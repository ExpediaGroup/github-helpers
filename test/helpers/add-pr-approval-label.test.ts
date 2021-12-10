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

import { CORE_APPROVED_PR_LABEL, PEER_APPROVED_PR_LABEL } from '../../src/constants';
import { addLabels } from '../../src/helpers/add-labels';
import { addPrApprovalLabel } from '../../src/helpers/add-pr-approval-label';
import { context } from '@actions/github';
import { getCoreMemberLogins } from '../../src/utils/get-core-member-logins';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({ rest: {} }))
}));
jest.mock('../../src/utils/get-core-member-logins');
jest.mock('../../src/helpers/add-labels');

(getCoreMemberLogins as jest.Mock).mockResolvedValue(['user1', 'user2', 'user3']);

const teams = 'team1\nteam2';

describe('addPrApprovalLabel', () => {
  const pull_number = '123';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('core approver case', () => {
    const login = 'user1';

    beforeEach(async () => {
      await addPrApprovalLabel({
        teams,
        login,
        pull_number
      });
    });

    it('should call getCoreMemberLogins with correct params', () => {
      expect(getCoreMemberLogins).toHaveBeenCalledWith(pull_number, ['team1', 'team2']);
    });

    it('should add core approved label to the pr', () => {
      expect(addLabels).toHaveBeenCalledWith({
        labels: CORE_APPROVED_PR_LABEL,
        pull_number,
        ...context.repo
      });
    });
  });

  describe('peer approver case', () => {
    const login = 'user6';

    beforeEach(async () => {
      await addPrApprovalLabel({
        teams,
        login,
        pull_number
      });
    });

    it('should add core approved label to the pr', () => {
      expect(addLabels).toHaveBeenCalledWith({
        labels: PEER_APPROVED_PR_LABEL,
        pull_number,
        ...context.repo
      });
    });
  });
});
