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
import { getChangedFiles } from '../../src/helpers/get-changed-files';
import { octokit } from '../../src/octokit';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({ rest: { pulls: { listFiles: jest.fn() } } }))
}));

const mock_data = [
  {
    sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
    filename: 'file/path/1/file1.txt',
    status: 'added',
    additions: 103,
    deletions: 21,
    changes: 124,
    blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
    patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
  },
  {
    sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
    filename: 'something/totally/different/file1.txt',
    status: 'added',
    additions: 103,
    deletions: 21,
    changes: 124,
    blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
    patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
  }
];
(octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async () => ({
  data: mock_data
}));

describe('getChangedFiles', () => {
  it('should return true if one of the file paths match the file paths that octokit returns', async () => {
    const result = await getChangedFiles();

    expect(result).toEqual(`${mock_data[0].filename},${mock_data[1].filename}`);
  });
});
