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

import { describe, it, expect, mock } from 'bun:test';
import type { Mocktokit } from '../types';

process.env.INPUT_GITHUB_TOKEN = 'mock-token';

const mockOctokit = {
  rest: {
    actions: {
      listWorkflowRunsForRepo: mock(() => ({})),
      reRunWorkflow: mock(() => ({}))
    },
    checks: {
      listForRef: mock(() => ({})),
      update: mock(() => ({}))
    },
    git: {
      deleteRef: mock(() => ({})),
      getCommit: mock(() => ({}))
    },
    issues: {
      addAssignees: mock(() => ({})),
      addLabels: mock(() => ({})),
      createComment: mock(() => ({})),
      get: mock(() => ({})),
      listComments: mock(() => ({})),
      listForRepo: mock(() => ({})),
      removeLabel: mock(() => ({})),
      update: mock(() => ({})),
      updateComment: mock(() => ({}))
    },
    pulls: {
      create: mock(() => ({})),
      createReview: mock(() => ({})),
      get: mock(() => ({})),
      list: mock(() => ({})),
      listFiles: mock(() => ({})),
      listReviews: mock(() => ({})),
      merge: mock(() => ({})),
      update: mock(() => ({}))
    },
    repos: {
      compareCommitsWithBasehead: mock(() => ({})),
      createCommitStatus: mock(() => ({})),
      createDeployment: mock(() => ({})),
      createDeploymentStatus: mock(() => ({})),
      deleteAnEnvironment: mock(() => ({})),
      deleteDeployment: mock(() => ({})),
      get: mock(() => ({})),
      getCombinedStatusForRef: mock(() => ({})),
      listBranches: mock(() => ({})),
      listBranchesForHeadCommit: mock(() => ({})),
      listCommitStatusesForRef: mock(() => ({})),
      listDeploymentStatuses: mock(() => ({})),
      listDeployments: mock(() => ({})),
      listPullRequestsAssociatedWithCommit: mock(() => ({})),
      merge: mock(() => ({})),
      mergeUpstream: mock(() => ({}))
    },
    teams: {
      listMembersInOrg: mock(() => ({}))
    },
    users: {
      getByUsername: mock(() => ({}))
    }
  },
  graphql: mock(() => ({}))
};

mock.module('@actions/core', () => ({
  getInput: () => 'mock-token',
  setOutput: () => {},
  setFailed: () => {},
  info: () => {},
  warning: () => {},
  error: () => {}
}));

mock.module('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 }, eventName: 'pull_request', ref: '' },
  getOctokit: mock(() => mockOctokit)
}));

mock.module('../../src/octokit', () => ({
  octokit: mockOctokit.rest,
  octokitGraphql: mockOctokit.graphql
}));

const { getChangedFiles } = await import('../../src/helpers/get-changed-files');
const { octokit } = await import('../../src/octokit');
const { context } = await import('@actions/github');

const mock_data1 = [
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
] as const;
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
] as const;
const mock_data3 = [
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
    filename: 'something/deleted/file/file2.txt',
    status: 'removed',
    additions: 103,
    deletions: 21,
    changes: 124,
    blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
    patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
  }
] as const;
const mock_data4 = [
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
    filename: 'something/renamed/file/file2.txt',
    status: 'renamed',
    additions: 103,
    deletions: 21,
    changes: 124,
    blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
    patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test',
    previous_filename: 'original/file/location/file2.txt'
  }
] as const;
(octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
  data: page === 1 ? mock_data1 : page === 2 ? mock_data2 : []
}));

describe('getChangedFiles', () => {
  it('case where one of the file paths match the file paths that octokit returns', async () => {
    const result = await getChangedFiles({});

    expect(result).toEqual([mock_data1[0].filename, mock_data1[1].filename, mock_data2[0].filename].join(','));
  });

  it('case where files returned from getChangedFiles matches the provided regex pattern', async () => {
    const result = await getChangedFiles({ pattern: 'file/path/1/file[0-9].txt' });

    expect(result).toEqual(mock_data1[0].filename);
  });

  it('case where files returned from getChangedFiles does not match the provided regex pattern', async () => {
    const result = await getChangedFiles({ pattern: 'a/fake/path/arandotex.test' });

    expect(result).toEqual('');
  });

  it('should ignore deleted files when ignore_deleted input is provided', async () => {
    (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
      data: page === 1 ? mock_data3 : []
    }));
    const result = await getChangedFiles({ ignore_deleted: 'true' });

    expect(result).toEqual(mock_data3[0].filename);
  });

  it('should include original location of renamed files, as if rename was an addition and deletion', async () => {
    (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
      data: page === 1 ? mock_data4 : []
    }));
    const result = await getChangedFiles({ ignore_deleted: 'true' });

    expect(result).toEqual([mock_data4[0].filename, mock_data4[1].filename, mock_data4[1].previous_filename].join(','));
  });

  it('should handle merge queue case', async () => {
    context.eventName = 'merge_group';
    context.ref = 'refs/heads/gh-readonly-queue/default-branch/pr-12345-f0d9a4cb862b13cdaab6522f72d6dc17e4336b7f';
    (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async ({ page, pull_number }) => ({
      data: pull_number === 12345 && page === 1 ? mock_data4 : []
    }));
    const result = await getChangedFiles({});

    expect(result).toEqual([mock_data4[0].filename, mock_data4[1].filename, mock_data4[1].previous_filename].join(','));
  });
});
