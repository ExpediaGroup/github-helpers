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
import { CatalogClient } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { simpleGit } from 'simple-git';
import { now } from 'lodash';

type DiscoveryApi = {
  getBaseUrl(pluginId: string): Promise<string>;
};

interface GetBackstageEntities {
  backstage_url?: string;
  backstage_entities_repo?: string;
}

async function getFileContentFromRepo(repoUrl: string, filePath: string): Promise<string> {
  const cloneDir = `/tmp/github-helpers-${now()}`;
  const git = simpleGit();

  try {
    await git.clone(repoUrl, cloneDir, ['--depth=1']);
    await git.cwd(cloneDir);

    const { current } = await git.branch();
    const defaultBranch = current || 'main';
    const fileContent: string = await git.show([`${defaultBranch}:${filePath}`]);

    await git.raw(['rm', '-rf', '.']);
    return fileContent;
  } catch (error) {
    throw new Error(`Failed to fetch ${repoUrl}/${filePath}: ${error}`);
  }
}

async function fetchBackstageEntitiesFromURL(backstage_url: string) {
  core.info('Connecting to Backstage to fetch available entities');

  const discoveryApi: DiscoveryApi = {
    async getBaseUrl() {
      return `${backstage_url}/api/catalog`;
    }
  };
  const catalogClient = new CatalogClient({
    discoveryApi
  });

  const entities = await catalogClient.getEntities({});
  core.info(`Total backstage entities: ${entities.items.length}`);

  return entities.items;
}

async function fetchBackstageEntitiesFromRepo(backstage_entities_repo: string) {
  const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';
  const repoUrl = `${serverUrl}/${backstage_entities_repo}`;
  core.info(`Cloning ${repoUrl}`);
  const content = await getFileContentFromRepo(repoUrl, 'filteredEntities.json');
  return JSON.parse(content) as Entity[];
}

export const getBackstageEntities = async ({ backstage_url, backstage_entities_repo }: GetBackstageEntities) => {
  // repo takes a priority over the URL in order to avoid unnecessary runtime
  // dependency
  if (backstage_entities_repo) {
    return fetchBackstageEntitiesFromRepo(backstage_entities_repo);
  } else if (backstage_url) {
    return fetchBackstageEntitiesFromURL(backstage_url);
  }
  throw new Error(
    'Backstage URL or entities repo is required. Set BACKSTAGE_URL (github secret) or pass backstage_entities_repo argument to this action'
  );
};
