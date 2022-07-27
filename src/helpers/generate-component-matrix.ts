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
import { CatalogClient } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';

type DiscoveryApi = {
  getBaseUrl(pluginId: string): Promise<string>;
};

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

export const generateComponentMatrix = async ({ backstage_url }: GenerateComponentMatrix) => {
  const eventName = process.env.GITHUB_EVENT_NAME;
  const changedFiles = await getChangedFiles(eventName);

  core.info(`Changed files: ${changedFiles}`);

  const discoveryApi: DiscoveryApi = {
    async getBaseUrl() {
      return `${backstage_url}/api/catalog`;
    }
  };
  const catalogClient = new CatalogClient({
    discoveryApi
  });

  const entities = await catalogClient.getEntities({});

  core.info(`Discovered entities: ${entities.items.length}`);
  const repoUrl = `${process.env.GITHUB_SERVER_URL}/${context.repo.owner}/${context.repo.repo}`;

  // const locations = entities.items.filter(item => item.spec?.type === 'contract').map(item => sourceLocation(item));
  // console.log(locations);

  const items = entities.items
    .filter(item => sourceLocation(item)?.startsWith(`url:${repoUrl}`))
    .filter(item => item.spec?.type === 'contract');

  // console.log(items);
  // console.log(items.length);
  return {
    include: items.map(item => ({
      name: item.metadata.name,
      tags: item.metadata.tags,
      path: sourceLocationDir(item)
    }))
  };
};
