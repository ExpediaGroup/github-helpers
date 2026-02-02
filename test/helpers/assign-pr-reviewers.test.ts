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
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: mock(() => mockOctokit)
}));

mock.module('../../src/octokit', () => ({
  octokit: mockOctokit.rest,
  octokitGraphql: mockOctokit.graphql
}));

const { assignPrReviewers } = await import('../../src/helpers/assign-pr-reviewers');
const { getCoreMemberLogins } = await import('../../src/utils/get-core-member-logins');
const { notifyUser } = await import('../../src/utils/notify-user');
const { octokit } = await import('../../src/octokit');
const { CORE_APPROVED_PR_LABEL, PEER_APPROVED_PR_LABEL } = await import('../../src/constants');
const { context } = await import('@actions/github');

(getCoreMemberLogins as Mock<any>).mockResolvedValue(['user1', 'user2', 'user3']);
(sampleSize as Mock<any>).mockReturnValue(['assignee']);

describe('assignPrReviewer', () => {
  const teams = 'team1\nteam2';
  const pull_number = 123;

  beforeEach(() => {
    (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
      data: {
        id: 1,
        number: 123,
        state: 'open',
        title: 'feat: added feature to project',
        user: {
          login: 'author'
        }
      }
    }));
  });

  describe('login provided', () => {
    describe('core member case', () => {
      const login = 'user1';

      beforeEach(() => {
        assignPrReviewers({ login, teams });
      });

      it('should call getCoreMemberLogins with correct params', () => {
        expect(getCoreMemberLogins).toHaveBeenCalledWith({ pull_number, teams: ['team1', 'team2'] });
      });

      it('should not call addAssignees', () => {
        expect(octokit.issues.addAssignees).not.toHaveBeenCalled();
      });
    });

    describe('not core member case', () => {
      const login = 'user4';

      beforeEach(() => {
        assignPrReviewers({ login, teams });
      });

      it('should call addAssignees with correct params', () => {
        expect(octokit.issues.addAssignees).toHaveBeenCalledWith({
          assignees: ['assignee'],
          issue_number: 123,
          ...context.repo
        });
      });
    });

    describe('author is a core member', () => {
      const login = 'user6';
      beforeEach(() => {
        (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
          data: {
            id: 1,
            number: 123,
            state: 'open',
            title: 'feat: added feature to project',
            user: {
              login: 'user1'
            }
          }
        }));
        assignPrReviewers({ login, teams });
      });

      it('should not include author in the assignees list', () => {
        expect(sampleSize).toHaveBeenCalledWith(['user2', 'user3'], 1);
      });
    });

    describe('already core approved', () => {
      const login = 'user6';
      beforeEach(() => {
        (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
          data: {
            id: 1,
            number: 123,
            state: 'open',
            title: 'feat: added feature to project',
            user: {
              login: 'user1'
            },
            labels: [
              {
                name: CORE_APPROVED_PR_LABEL
              }
            ]
          }
        }));
        assignPrReviewers({ login, teams });
      });

      it('should not call addAssignees', () => {
        expect(octokit.issues.addAssignees).not.toHaveBeenCalled();
      });
    });

    describe('not core approved', () => {
      const login = 'user6';
      beforeEach(() => {
        (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
          data: {
            id: 1,
            number: 123,
            state: 'open',
            title: 'feat: added feature to project',
            user: {
              login: 'user1'
            },
            labels: [
              {
                name: PEER_APPROVED_PR_LABEL
              }
            ]
          }
        }));
        assignPrReviewers({ login, teams });
      });

      it('should call addAssignee', () => {
        expect(sampleSize).toHaveBeenCalledWith(['user2', 'user3'], 1);
      });
    });

    describe('override pull_number', () => {
      const login = 'user4';
      const pull_number_2 = '456';

      beforeEach(() => {
        assignPrReviewers({ login, teams, pull_number: pull_number_2 });
      });

      it('pull_number should come from the argument', () => {
        expect(octokit.issues.addAssignees).toHaveBeenCalledWith({
          assignees: ['assignee'],
          issue_number: 456,
          ...context.repo
        });
      });
    });
  });

  describe('login not provided', () => {
    beforeEach(() => {
      assignPrReviewers({ teams });
    });

    it('should call addAssignees with correct params', () => {
      expect(octokit.issues.addAssignees).toHaveBeenCalledWith({
        assignees: ['assignee'],
        issue_number: 123,
        ...context.repo
      });
    });
  });

  describe('slack url provided', () => {
    const slack_webhook_url = 'url';

    beforeEach(async () => {
      await assignPrReviewers({ teams, slack_webhook_url });
    });

    it('should call notifyUser with correct params', () => {
      expect(notifyUser).toHaveBeenCalledWith({
        login: 'assignee',
        pull_number,
        slack_webhook_url
      });
    });
  });
});
