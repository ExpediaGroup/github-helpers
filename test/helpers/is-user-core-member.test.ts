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

import { Mock, beforeEach, describe, expect, it, mock } from 'bun:test';

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

const { isUserCoreMember } = await import('../../src/helpers/is-user-core-member');
const { getCoreMemberLogins } = await import('../../src/utils/get-core-member-logins');

describe('isUserCoreMember', () => {
  const login = 'octocat';
  const pull_number = '123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call isUserCoreMember with correct params and find user as core member', async () => {
    (getCoreMemberLogins as Mock<any>).mockResolvedValue(['octocat', 'admin']);

    const response = await isUserCoreMember({ login, pull_number });

    expect(getCoreMemberLogins).toHaveBeenCalledWith({ pull_number: Number(pull_number) });
    expect(response).toBe(true);
  });

  it('should call isUserCoreMember with correct params and find user as core member when CODEOWNERS overrides are specified', async () => {
    (getCoreMemberLogins as Mock<any>).mockResolvedValue(['octocat', 'admin']);

    const response = await isUserCoreMember({ login, pull_number, codeowners_overrides: '/foo @octocat' });

    expect(getCoreMemberLogins).toHaveBeenCalledWith({ pull_number: Number(pull_number), codeowners_overrides: '/foo @octocat' });
    expect(response).toBe(true);
  });

  it('should call isUserCoreMember with correct params and find user as core member for context actor', async () => {
    (getCoreMemberLogins as Mock<any>).mockResolvedValue(['admin']);

    const response = await isUserCoreMember({ pull_number });

    expect(getCoreMemberLogins).toHaveBeenCalledWith({ pull_number: Number(pull_number) });
    expect(response).toBe(true);
  });

  it('should call isUserCoreMember with correct params and find user not as core member', async () => {
    (getCoreMemberLogins as Mock<any>).mockResolvedValue(['admin']);

    const response = await isUserCoreMember({ login, pull_number });

    expect(getCoreMemberLogins).toHaveBeenCalledWith({ pull_number: Number(pull_number) });
    expect(response).toBe(false);
  });
});
