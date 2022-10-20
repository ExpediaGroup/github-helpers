/*
Copyright 2022 Aurora Labs
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as core from '@actions/core';
import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import { getChangedFiles } from '../utils/get-changed-files';
import { Entity } from '@backstage/catalog-model';
import * as path from 'path';
import * as fs from 'fs';
import { getBackstageEntities } from '../utils/get-backstage-entities';

export class GenerateComponentMatrix extends HelperInputs {
  backstage_url?: string;
}

function sourceLocation(entity: Entity) {
  if (!entity.metadata.annotations) return;
  const loc = entity.metadata.annotations['backstage.io/source-location'];
  return loc;
}

function sourceLocationDir(entity: Entity) {
  const loc = sourceLocation(entity)!;
  return loc.split('/').slice(7, -1).join('/');
}

/**
 * Finds the first parent directory that contains rootFile.
 * If the rootFile is not found, returns ./
 */
function findRoot(fileName: string, rootFile: string) {
  const dirs = fileName.split('/');
  core.info(`searching ${rootFile} for ${fileName}`);

  for (;;) {
    const testFile = path.join('./', ...dirs, rootFile);
    core.info(`checking: ${testFile}`);
    if (fs.existsSync(testFile)) {
      core.info(`Found ${rootFile} root for ${fileName}:`);
      core.info(dirs.join('/'));
      break;
    }
    if (dirs.length === 0) {
      core.info(`Unable to find ${rootFile} for ${fileName}, using the default`);
      break;
    }
    // eslint-disable-next-line functional/immutable-data
    dirs.pop();
  }
  return dirs.length > 0 ? dirs.join('/') : '.';
}

export const generateComponentMatrix = async ({ backstage_url }: GenerateComponentMatrix) => {
  const entities = await getBackstageEntities({ backstage_url });
  const repoUrl = `${process.env.GITHUB_SERVER_URL}/${context.repo.owner}/${context.repo.repo}`;

  const contractItems = entities
    .filter(item => sourceLocation(item)?.startsWith(`url:${repoUrl}/`))
    .filter(item => item.spec?.type === 'contract');

  const contractItemNames = contractItems.map(item => item.metadata.name);

  core.info(`Contract entities in this repo: ${contractItems.length} (${contractItemNames})`);

  const eventName = process.env.GITHUB_EVENT_NAME;
  const changedFiles = await getChangedFiles(eventName);

  core.info(`Changed files count: ${changedFiles.length}`);

  const changedContracts = contractItems.filter(contractItem =>
    changedFiles.some(file => {
      const loc = sourceLocation(contractItem)!;
      return file.file.startsWith(loc);
    })
  );

  core.info(`Changed contracts: ${Object.keys(changedContracts).length} ({${Object.keys(changedContracts)}})`);

  const forceAll = eventName !== 'pull_request';
  if (forceAll) core.info('forcing CI runs for all components (not a pull request)');

  core.info('Generating component matrix...');

  const matrix = {
    include: contractItems.map(item => {
      const isSolidity = ['ethereum', 'aurora'].some(tag => item.metadata.tags!.includes(tag));
      const isRust = item.metadata.tags!.includes('near');
      const runSlither = isSolidity && (forceAll || changedContracts.includes(item));
      const runClippy = isRust && (forceAll || changedContracts.includes(item));

      return {
        name: item.metadata.name,
        tags: item.metadata.tags,
        path: sourceLocationDir(item),
        nodeRoot: findRoot(sourceLocationDir(item)!, 'package.json'),
        runSlither,
        runClippy
      };
    })
  };

  core.info(JSON.stringify(matrix, null, 2));

  return matrix;
};
