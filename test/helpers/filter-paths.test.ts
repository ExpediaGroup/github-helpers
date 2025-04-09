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
import { filterPaths } from '../../src/helpers/filter-paths';
import { octokit } from '../../src/octokit';
import { context } from '@actions/github';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: { listFiles: jest.fn() },
      repos: { listPullRequestsAssociatedWithCommit: jest.fn(() => ({ data: [{ number: 789 }] })) }
    }
  }))
}));

describe('filterPaths', () => {
  const paths = 'file/path/1\nfile/path/2';
  const globs = '**/*.md\nsomething/**/file1.txt';

  it('should return true if one of the file paths match the file paths that octokit returns', async () => {
    (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
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
      ]
    }));
    const result = await filterPaths({
      paths
    });

    expect(result).toBe(true);
  });

  it('should return false if none of the file paths match the file paths that octokit returns', async () => {
    (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
          filename: 'file/bogus/1/file1.txt',
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
      ]
    }));
    const result = await filterPaths({
      paths
    });

    expect(result).toBe(false);
  });

  it('should return true if one of the globs match the file paths that octokit returns', async () => {
    (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
          filename: 'file/bogus/1/file1.txt',
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
      ]
    }));
    const result = await filterPaths({
      globs
    });

    expect(result).toBe(true);
  });

  it('should return false when data is an empty array', async () => {
    const exactFilePath = 'exact/file/path';
    (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async () => ({
      data: []
    }));
    const result = await filterPaths({
      paths: exactFilePath,
      globs
    });

    expect(result).toBe(false);
  });

  it('exact file path case', async () => {
    const exactFilePath = 'exact/file/path';
    (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
          filename: exactFilePath,
          status: 'added',
          additions: 103,
          deletionsfalse: 124,
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
      ]
    }));
    const result = await filterPaths({
      paths: exactFilePath
    });

    expect(result).toBe(true);
  });

  it('should call listFiles with correct pr number in sha case', async () => {
    await filterPaths({
      paths,
      sha: 'sha'
    });

    expect(octokit.pulls.listFiles).toHaveBeenCalledWith({
      per_page: 100,
      pull_number: 789,
      ...context.repo
    });
  });

  it('should call listFiles with correct pr number in merge queue case', async () => {
    context.eventName = 'merge_group';
    context.ref = 'refs/heads/gh-readonly-queue/default-branch/pr-12345-f0d9a4cb862b13cdaab6522f72d6dc17e4336b7f';
    await filterPaths({
      paths
    });

    expect(octokit.pulls.listFiles).toHaveBeenCalledWith({
      per_page: 100,
      pull_number: 12345,
      ...context.repo
    });
    expect(octokit.repos.listPullRequestsAssociatedWithCommit).not.toHaveBeenCalled();
  });

  it('should return false when no filtering params are passed', async () => {
    const result = await filterPaths({});

    expect(result).toBe(false);
    expect(octokit.pulls.listFiles).not.toHaveBeenCalled();
    expect(octokit.repos.listPullRequestsAssociatedWithCommit).not.toHaveBeenCalled();
  });

  describe('tests related to the packages parameter', () => {
    it('should return true if one of the packages matches a changed package in package.json', async () => {
      (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async () => ({
        data: [
          {
            sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
            filename: 'package.json',
            status: 'added',
            additions: 103,
            deletions: 21,
            changes: 124,
            blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
            raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
            contents_url:
              'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
            patch: `
        @@ -143,7 +143,7 @@
       "@shared-ui/retail-activities-reviews": "15.0.0",
       "@shared-ui/retail-affiliates-stripe": "1.13.7",
       "@shared-ui/retail-communication-center-preview-menu": "2.0.0",
  -    "@shared-ui/retail-compare-providers": "5.0.5",
  +    "@shared-ui/retail-compare-providers": "5.0.6",
       "@shared-ui/retail-compare-toggle": "1.0.2",
       "@shared-ui/retail-credit-card-account-placement": "2.0.0",
       "@shared-ui/retail-customer-direct-feedback": "4.0.0",
  `
          }
        ]
      }));
      const result = await filterPaths({
        globs,
        packages: '@shared-ui/retail-compare-providers'
      });

      expect(result).toBe(true);
    });

    it('should return false if no package matches a changed package in package.json', async () => {
      (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async () => ({
        data: [
          {
            sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
            filename: 'package.json',
            status: 'added',
            additions: 103,
            deletions: 21,
            changes: 124,
            blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
            raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
            contents_url:
              'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
            patch: `
            @@ -142,7 +142,7 @@
       "@shared-ui/retail-activities-cross-sell-rate-calendar": "4.0.0",
       "@shared-ui/retail-activities-reviews": "15.0.0",
       "@shared-ui/retail-affiliates-stripe": "1.13.7",
  -    "@shared-ui/retail-communication-center-preview-menu": "2.0.0",
  +    "@shared-ui/retail-communication-center-preview-menu": "2.0.1",
       "@shared-ui/retail-compare-providers": "5.0.5",
       "@shared-ui/retail-compare-toggle": "1.0.2",
       "@shared-ui/retail-credit-card-account-placement": "2.0.0",
  `
          }
        ]
      }));
      const result = await filterPaths({
        globs,
        packages: '@shared-ui/retail-compare-providers'
      });

      expect(result).toBe(false);
    });

    it('should return false if there are no package.json changes', async () => {
      (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async () => ({
        data: [
          {
            sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
            filename: 'not-package.json',
            status: 'added',
            additions: 103,
            deletions: 21,
            changes: 124,
            blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
            raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
            contents_url:
              'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
            patch:
              '@@ -132,7 +132,7 @@ "@shared-ui/retail-property-offers": "2.0.1", @@ -1000,7 +1000,7 @@ "@shared-ui/retail-property-offers": "2.0.1",'
          }
        ]
      }));
      const result = await filterPaths({
        globs,
        packages: '@shared-ui/retail-lodging-compare'
      });

      expect(result).toBe(false);
    });

    it('should return false if patch is undefined', async () => {
      (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async () => ({
        data: [
          {
            sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
            filename: 'not-package.json',
            status: 'added',
            additions: 103,
            deletions: 21,
            changes: 124,
            blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
            raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
            contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e'
          }
        ]
      }));
      const result = await filterPaths({
        globs,
        packages: '@shared-ui/retail-lodging-compare'
      });

      expect(result).toBe(false);
    });
  });
});
