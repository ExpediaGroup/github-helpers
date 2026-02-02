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

import { describe, it, expect, beforeEach } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

// Mock getCoreMemberLogins
mock.module('../../src/utils/get-core-member-logins', () => ({
  getCoreMemberLogins: mock(() => Promise.resolve(['user1', 'user2', 'user3', 'user4', 'user5'])),
  getRequiredCodeOwnersEntries: mock(() => Promise.resolve([]))
}));

const { CORE_APPROVED_PR_LABEL, PEER_APPROVED_PR_LABEL } = await import('../../src/constants');
const { addPrApprovalLabel } = await import('../../src/helpers/add-pr-approval-label');
const { context } = await import('@actions/github');
const { getCoreMemberLogins } = await import('../../src/utils/get-core-member-logins');
const { octokit } = await import('../../src/octokit');

const teams = 'team1\nteam2';

describe('addPrApprovalLabel', () => {
  beforeEach(() => {
    mock.restore();
  });

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
