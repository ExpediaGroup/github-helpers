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

import { beforeEach, describe, expect, it } from 'bun:test';

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
  context: { repo: { repo: 'repo', owner: 'owner' }, payload: {} },
  getOctokit: mock(() => mockOctokit)
}));

mock.module('../../src/octokit', () => ({
  octokit: mockOctokit.rest,
  octokitGraphql: mockOctokit.graphql
}));

const { createBatchedCommitMessage } = await import('../../src/helpers/create-batched-commit-message');
const { context } = await import('@actions/github');

describe('createBatchedCommitMessage', () => {
  beforeEach(() => {
    context.payload.commits = [
      {
        id: '1234567890abcdef',
        message: 'Fix issue (#1)',
        author: { name: 'John Doe', email: '' }
      },
      {
        id: '1234567891abcdef',
        message: 'Fix another issue (#2)',
        author: { name: 'Jane Doe', email: '' }
      }
    ];
  });
  it('should generate combined commit message', () => {
    const result = createBatchedCommitMessage();
    expect(result).toBe('Fix issue (#1) and Fix another issue (#2)');
  });
});

describe('createBatchedCommitMessage long messages', () => {
  beforeEach(() => {
    context.payload.commits = [
      {
        id: '1234567890abcdef',
        message: 'Fix a really really really really really long issue (#1)',
        author: { name: 'John Doe', email: '' }
      },
      {
        id: '1234567891abcdef',
        message: 'Fix another really really really really really long issue (#2)',
        author: { name: 'Jane Doe', email: '' }
      }
    ];
  });
  it('should truncate the message', () => {
    const result = createBatchedCommitMessage();
    expect(result).toBe(
      'Fix a really really really really really long issu... (#1) and Fix another really really really really really lon... (#2)'
    );
  });
});

describe('createBatchedCommitMessage multiline messages', () => {
  beforeEach(() => {
    context.payload.commits = [
      {
        id: '1234567890abcdef',
        message: 'Fix a really really long issue \n' + '  \n' + '  * fix the issue\n' + '  \n' + '  * definitely fix the issue (#1)',
        author: { name: 'John Doe', email: '' }
      },
      {
        id: '1234567891abcdef',
        message: 'Fix another really really long issue \n' + '  \n' + '  * fix the issue\n' + '  \n' + '  * definitely fix the issue (#2)',
        author: { name: 'Jane Doe', email: '' }
      }
    ];
  });
  it('should truncate the message', () => {
    const result = createBatchedCommitMessage();
    expect(result).toBe('Fix a really really long issue (#1) and Fix another really really long issue (#2)');
  });
});
