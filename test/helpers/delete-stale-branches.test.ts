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

import { Mock, describe, expect, it, mock, spyOn } from 'bun:test';

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
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: mock(() => mockOctokit)
}));

mock.module('../../src/octokit', () => ({
  octokit: mockOctokit.rest,
  octokitGraphql: mockOctokit.graphql
}));

spyOn(Date, 'now').mockImplementation(() => new Date('2023-02-24T10:00:00Z').getTime());

const { deleteStaleBranches } = await import('../../src/helpers/delete-stale-branches');
const { octokit } = await import('../../src/octokit');
const { paginateAllOpenPullRequests } = await import('../../src/utils/paginate-open-pull-requests');
const { context } = await import('@actions/github');

(paginateAllOpenPullRequests as Mock<any>).mockResolvedValue([
  { head: { ref: 'branch-with-open-pr' } },
  { head: { ref: 'some-other-branch' } }
]);

describe('deleteStaleBranches', () => {
  it('should call octokit deleteRef with correct branch names', async () => {
    await deleteStaleBranches({ days: '1' });

    expect(octokit.git.deleteRef).not.toHaveBeenCalledWith({
      ref: 'heads/main',
      ...context.repo
    });
    expect(octokit.git.deleteRef).not.toHaveBeenCalledWith({
      ref: 'heads/new-branch-no-open-pr',
      ...context.repo
    });
    expect(octokit.git.deleteRef).not.toHaveBeenCalledWith({
      ref: 'heads/branch-with-open-pr',
      ...context.repo
    });
    expect(octokit.git.deleteRef).toHaveBeenCalledWith({
      ref: 'heads/old-branch-with-no-open-pr',
      ...context.repo
    });
  });
});
