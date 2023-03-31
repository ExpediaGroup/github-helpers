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

import { Mocktokit } from '../types';
import { generateComponentMatrix } from '../../src/helpers/generate-component-matrix';
import { octokit } from '../../src/octokit';
import { CatalogApi, GetEntitiesResponse } from '@backstage/catalog-client';
import { SimpleGit } from 'simple-git';

const file1 = 'file/path/1/file1.txt';
const file2 = 'packages/abc/file1.ts';
const file3 = 'packages/def/file1.txt';
const file4 = 'packages/ghi/more/dirs/file1.md';
const file5 = 'docs/xyz/file1.js';
const pkg = 'package.json';

const entitiesBlob = ['abc', 'def'].map(pkgName => {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      uid: `46fe5cd6-4fd9-4522-b2a2-${pkgName}`,
      namespace: 'default',
      name: pkgName,
      annotations: {
        'backstage.io/source-location': `url:https://github.com/aurora-is-near/rainbow-bridge/tree/master/packages/${pkgName}/`,
        'aurora.dev/security-tier': '1'
      },
      tags: ['contract', 'near']
    },
    spec: {
      type: 'contract'
    }
  };
});

const getEntitiesMock = (): Promise<GetEntitiesResponse> => {
  return Promise.resolve({
    items: entitiesBlob
  } as GetEntitiesResponse);
};
const catalogApi: jest.Mocked<CatalogApi> = {
  getEntities: jest.fn()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const simpleGitMock: jest.Mocked<SimpleGit> = {
  show: jest.fn(),
  clone: () => {},
  branch: async () => {
    return { current: 'main' };
  },
  cwd: () => {},
  raw: () => {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

catalogApi.getEntities.mockImplementation(getEntitiesMock);

jest.mock('@actions/core');
jest.mock('simple-git', () => ({
  simpleGit: () => simpleGitMock
}));

jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'rainbow-bridge', owner: 'aurora-is-near' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: { listFiles: jest.fn() },
      repos: { getContent: jest.fn() }
    }
  }))
}));

jest.mock('@backstage/catalog-client', () => ({
  CatalogClient: jest.fn(() => catalogApi)
}));

(simpleGitMock.show as unknown as Mocktokit).mockImplementation(async () => {
  return JSON.stringify(entitiesBlob);
});
(octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
  data:
    page === 1
      ? [
          {
            filename: file1
          },
          {
            filename: file2
          },
          {
            filename: file3
          },
          {
            filename: file4
          },
          {
            filename: file5
          },
          {
            filename: pkg
          }
        ]
      : []
}));

describe('generateComponentMatrix', () => {
  const filePath1 = 'packages/abc';
  const filePath2 = 'packages/def';

  describe('no override filter paths case', () => {
    it('should return expected result with backstage_url', async () => {
      const result = await generateComponentMatrix({
        backstage_url: process.env.BACKSTAGE_URL
      });

      expect(result.include.map(i => i.path)).toEqual([filePath1, filePath2]);
    });

    it('should return expected result with backstage_entities_repo', async () => {
      const result = await generateComponentMatrix({
        backstage_entities_repo: process.env.BACKSTAGE_ENTITIES_REPO
      });
      expect(result.include.map(i => i.path)).toEqual([filePath1, filePath2]);
    });
  });
});
