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

import { describe, expect, it, mock } from 'bun:test';
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
  context: { repo: { repo: 'repo', owner: 'owner' }, ref: '' },
  getOctokit: mock(() => mockOctokit)
}));

mock.module('../../src/octokit', () => ({
  octokit: mockOctokit.rest,
  octokitGraphql: mockOctokit.graphql
}));

const { getMergeQueuePosition } = await import('../../src/helpers/get-merge-queue-position');
const { octokitGraphql } = await import('../../src/octokit');
const { context } = await import('@actions/github');


type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
function mockGraphQLResponse(mergeQueueEntries: RecursivePartial<MergeQueueEntry>[]) {
  (octokitGraphql as unknown as Mocktokit).mockImplementation(async () => ({
    repository: {
      mergeQueue: {
        entries: {
          nodes: mergeQueueEntries
        }
      }
    }
  }));
}

describe('getMergeQueuePosition', () => {
  it('should return 1 for PR 1st in the queue', async () => {
    context.ref = 'refs/heads/gh-readonly-queue/default-branch/pr-123-f0d9a4cb862b13cdaab6522f72d6dc17e4336b7f';
    mockGraphQLResponse([
      { position: 1, pullRequest: { number: 123 } },
      { position: 2, pullRequest: { number: 456 } }
    ]);
    const result = await getMergeQueuePosition({});
    expect(result).toBe(1);
  });

  it('should return 3 for PR 3rd in the queue', async () => {
    context.ref = 'refs/heads/gh-readonly-queue/default-branch/pr-789-f0d9a4cb862b13cdaab6522f72d6dc17e4336b7f';
    mockGraphQLResponse([
      { position: 1, pullRequest: { number: 123 } },
      { position: 2, pullRequest: { number: 456 } },
      { position: 3, pullRequest: { number: 789 } }
    ]);
    const result = await getMergeQueuePosition({});
    expect(result).toBe(3);
  });
});
