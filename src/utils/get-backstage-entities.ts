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

type DiscoveryApi = {
  getBaseUrl(pluginId: string): Promise<string>;
};

interface GetBackstageEntities {
  backstage_url?: string;
}

export const getBackstageEntities = async ({ backstage_url }: GetBackstageEntities) => {
  if (!backstage_url) {
    throw new Error('BACKSTAGE_URL is required, make sure to set the secret');
  }

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
};
