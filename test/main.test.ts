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

import { describe, it, expect, beforeEach, mock, spyOn } from 'bun:test';
import type { Mock } from 'bun:test';

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

const mockGetInput = mock(() => 'create-pr-comment');
const mockSetOutput = mock(() => {});
const mockSetFailed = mock(() => {});
const mockInfo = mock(() => {});
const mockWarning = mock(() => {});
const mockError = mock(() => {});

mock.module('@actions/core', () => ({
  getInput: mockGetInput,
  setOutput: mockSetOutput,
  setFailed: mockSetFailed,
  info: mockInfo,
  warning: mockWarning,
  error: mockError
}));

mock.module('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: mock(() => mockOctokit)
}));

mock.module('../../src/octokit', () => ({
  octokit: mockOctokit.rest,
  octokitGraphql: mockOctokit.graphql
}));

const mockGetActionInputs = mock(() => ({ my: 'input', another: 'input' }));

mock.module('../src/utils/get-action-inputs', () => ({
  getActionInputs: mockGetActionInputs
}));

const mockCreatePrComment = mock(() => Promise.resolve('some output'));

mock.module('../src/helpers/create-pr-comment', () => ({
  createPrComment: mockCreatePrComment
}));

const core = await import('@actions/core');
const { getInput } = await import('@actions/core');
const { getActionInputs } = await import('../src/utils/get-action-inputs');
const helperModule = await import('../src/helpers/create-pr-comment');
const { run } = await import('../src/main');

const helperSpy = mockCreatePrComment;
const helper = 'create-pr-comment';
const otherInputs = {
  my: 'input',
  another: 'input'
};
const output = 'some output';
(getInput as Mock<any>).mockReturnValue(helper);
(getActionInputs as Mock<any>).mockReturnValue(otherInputs);
(helperSpy as Mock<any>).mockResolvedValue(output);

describe('main', () => {
  beforeEach(async () => {
    await run();
  });

  it('should call getActionInputs with correct params', () => {
    const requiredInputs = ['body'];
    expect(getActionInputs).toHaveBeenCalledWith(requiredInputs);
  });

  it('should call helper with all inputs', () => {
    expect(helperSpy).toHaveBeenCalledWith(otherInputs);
  });

  it('should set output', () => {
    expect(core.setOutput).toHaveBeenCalledWith('output', output);
  });
});
