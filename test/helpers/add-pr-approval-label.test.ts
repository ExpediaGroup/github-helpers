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

import { describe, it, expect, beforeEach, mock } from 'bun:test';
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

mock.module('@actions/core', () => ({
  getInput: () => 'mock-token',
  setOutput: () => {},
  setFailed: () => {},
  info: () => {},
  warning: () => {},
  error: () => {}
}));

mock.module('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: mock(() => mockOctokit)
}));

mock.module('../../src/octokit', () => ({
  octokit: mockOctokit.rest,
  octokitGraphql: mockOctokit.graphql
}));

const mockGetCoreMemberLogins = mock(() => Promise.resolve(['user1', 'user2', 'user3']));

mock.module('../../src/utils/get-core-member-logins', () => ({
  getCoreMemberLogins: mockGetCoreMemberLogins
}));

const { CORE_APPROVED_PR_LABEL, PEER_APPROVED_PR_LABEL } = await import('../../src/constants');
const { addPrApprovalLabel } = await import('../../src/helpers/add-pr-approval-label');
const { context } = await import('@actions/github');
const { getCoreMemberLogins } = await import('../../src/utils/get-core-member-logins');
const { octokit } = await import('../../src/octokit');

const teams = 'team1\nteam2';

describe('addPrApprovalLabel', () => {
  describe('core approver case', () => {
    const login = 'user1';

    beforeEach(async () => {
      await addPrApprovalLabel({
        teams,
        login
      });
    });

    it('should call getCoreMemberLogins with correct params', () => {
      expect(getCoreMemberLogins).toHaveBeenCalledWith({ pull_number: 123, teams: ['team1', 'team2'] });
    });

    it('should add core approved label to the pr', () => {
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: [CORE_APPROVED_PR_LABEL],
        issue_number: 123,
        ...context.repo
      });
    });
  });

  describe('peer approver case', () => {
    const login = 'user6';

    beforeEach(async () => {
      await addPrApprovalLabel({
        teams,
        login
      });
    });

    it('should add core approved label to the pr', () => {
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: [PEER_APPROVED_PR_LABEL],
        issue_number: 123,
        ...context.repo
      });
    });
  });
});
