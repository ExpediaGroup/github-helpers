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

import { describe, it, expect, beforeEach, afterEach, Mock, mock, spyOn } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

const { assignPrReviewers } = await import('../../src/helpers/assign-pr-reviewers');
const getCoreMemberLoginsModule = await import('../../src/utils/get-core-member-logins');
const notifyUserModule = await import('../../src/utils/notify-user');
const { octokit } = await import('../../src/octokit');
const { CORE_APPROVED_PR_LABEL, PEER_APPROVED_PR_LABEL } = await import('../../src/constants');
const { context } = await import('@actions/github');
const lodashModule = await import('lodash');

describe('assignPrReviewer', () => {
  const teams = 'team1\nteam2';
  const pull_number = 123;
  let getCoreMemberLoginsSpy: ReturnType<typeof spyOn>;
  let sampleSizeSpy: ReturnType<typeof spyOn>;
  let notifyUserSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    mock.clearAllMocks();
    getCoreMemberLoginsSpy = spyOn(getCoreMemberLoginsModule, 'getCoreMemberLogins').mockResolvedValue(['user1', 'user2', 'user3']);
    sampleSizeSpy = spyOn(lodashModule, 'sampleSize').mockReturnValue(['assignee'] as any);
    notifyUserSpy = spyOn(notifyUserModule, 'notifyUser').mockResolvedValue(undefined);
  });

  afterEach(() => {
    getCoreMemberLoginsSpy.mockRestore();
    sampleSizeSpy.mockRestore();
    notifyUserSpy.mockRestore();
  });

  describe('login provided', () => {
    describe('core member case', () => {
      const login = 'user1';

      beforeEach(async () => {
        await assignPrReviewers({ login, teams });
      });

      it('should call getCoreMemberLogins with correct params', () => {
        expect(getCoreMemberLoginsModule.getCoreMemberLogins).toHaveBeenCalledWith({ pull_number, teams: ['team1', 'team2'] });
      });

      it('should not call addAssignees', () => {
        expect(octokit.issues.addAssignees).not.toHaveBeenCalled();
      });
    });

    describe('not core member case', () => {
      const login = 'user4';

      beforeEach(async () => {
        await assignPrReviewers({ login, teams });
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
      beforeEach(async () => {
        (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
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
        await assignPrReviewers({ login, teams });
      });

      it('should not include author in the assignees list', () => {
        expect(lodashModule.sampleSize).toHaveBeenCalledWith(['user2', 'user3'], 1);
      });
    });

    describe('already core approved', () => {
      const login = 'user6';
      beforeEach(async () => {
        (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
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
        await assignPrReviewers({ login, teams });
      });

      it('should not call addAssignees', () => {
        expect(octokit.issues.addAssignees).not.toHaveBeenCalled();
      });
    });

    describe('not core approved', () => {
      const login = 'user6';
      beforeEach(async () => {
        (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
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
        await assignPrReviewers({ login, teams });
      });

      it('should call addAssignee', () => {
        expect(lodashModule.sampleSize).toHaveBeenCalledWith(['user2', 'user3'], 1);
      });
    });

    describe('override pull_number', () => {
      const login = 'user4';
      const pull_number_2 = '456';

      beforeEach(async () => {
        await assignPrReviewers({ login, teams, pull_number: pull_number_2 });
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
    beforeEach(async () => {
      await assignPrReviewers({ teams });
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
      expect(notifyUserModule.notifyUser).toHaveBeenCalledWith({
        login: 'assignee',
        pull_number,
        slack_webhook_url
      });
    });
  });
});
