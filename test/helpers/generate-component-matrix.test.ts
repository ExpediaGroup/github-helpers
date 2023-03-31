/*
Copyright 2021 Expedia, Inc.
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

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'rainbow-bridge', owner: 'aurora-is-near' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({ rest: { pulls: { listFiles: jest.fn() } } }))
}));

const file1 = 'file/path/1/file1.txt';
const file2 = 'packages/abc/file1.ts';
const file3 = 'packages/def/file1.txt';
const file4 = 'packages/ghi/more/dirs/file1.md';
const file5 = 'docs/xyz/file1.js';
const pkg = 'package.json';
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
  const filePath2 = 'file';

  describe('no override filter paths case', () => {
    it('should return expected result', async () => {
      const result = await generateComponentMatrix({
        backstage_url: process.env.BACKSTAGE_URL
      });
      expect(result).toEqual({
        include: [
          {
            path: filePath1
          },
          {
            path: filePath2
          }
        ]
      });
    });
  });
});
