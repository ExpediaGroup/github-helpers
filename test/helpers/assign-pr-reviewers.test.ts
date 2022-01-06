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

import { assignPrReviewers } from '../../src/helpers/assign-pr-reviewers';
import { context } from '@actions/github';
import { getCoreMemberLogins } from '../../src/utils/get-core-member-logins';
import { notifyReviewer } from '../../src/utils/notify-reviewer';
import { octokit } from '../../src/octokit';
import { sampleSize } from 'lodash';

jest.mock('../../src/utils/get-core-member-logins');
jest.mock('../../src/utils/notify-reviewer');
jest.mock('@actions/core');
jest.mock('lodash');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      issues: { addAssignees: jest.fn(async () => 'result') }
    }
  }))
}));
(getCoreMemberLogins as jest.Mock).mockResolvedValue(['user1', 'user2', 'user3']);
(sampleSize as jest.Mock).mockReturnValue(['assignee']);

describe('assignPrReviewer', () => {
  const teams = 'team1\nteam2';
  const pull_number = 123;

  describe('login provided', () => {
    describe('core member case', () => {
      const login = 'user1';

      beforeEach(() => {
        assignPrReviewers({ login, teams });
      });

      it('should call getCoreMemberLogins with correct params', () => {
        expect(getCoreMemberLogins).toHaveBeenCalledWith(pull_number, ['team1', 'team2']);
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

    it.each(['assignee'])('should call notifyReviewer with correct params', assignee => {
      expect(notifyReviewer).toHaveBeenCalledWith({
        login: assignee,
        pull_number,
        slack_webhook_url
      });
    });
  });
});
