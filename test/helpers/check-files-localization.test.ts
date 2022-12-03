/*
Copyright 2022 Expedia, Inc.
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
import { checkFilesLocalization } from '../../src/helpers/check-files-localization';
import { octokit } from '../../src/octokit';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({ rest: { pulls: { listFiles: jest.fn() } } }))
}));

const mock_data1 = [
  {
    sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
    filename: 'src/main/resources/messages_en_US.properties',
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
const mock_data2 = [
  {
    sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
    filename: 'file/path/2/file2.txt',
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
(octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
  data: page === 1 ? mock_data1 : page === 2 ? mock_data2 : []
}));

describe('checkFilesLocalization', () => {
  it('should return true if files returned from getChangedFiles contains the properties file', async () => {
    const result = await checkFilesLocalization({});

    expect(result).toEqual(true);
  });
});
