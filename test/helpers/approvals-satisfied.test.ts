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

import { Mocktokit } from '../types';
import { approvalsSatisfied } from '../../src/helpers/approvals-satisfied';
import { octokit } from '../../src/octokit';
import { getCoreMemberLogins } from '../../src/utils/get-core-member-logins';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: {
        listReviews: jest.fn()
      }
    }
  }))
}));
jest.mock('../../src/utils/get-core-member-logins');
(getCoreMemberLogins as jest.Mock).mockResolvedValue(['user1', 'user2']);

describe('approvalsSatisfied', () => {
  it('should return false when a core member has not approved', async () => {
    (octokit.pulls.listReviews as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          state: 'CHANGES_REQUESTED',
          user: { login: 'user1' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user3' }
        }
      ]
    }));
    const result = await approvalsSatisfied({ teams: 'some-maintainer-team' });
    expect(result).toBe(false);
  });

  it('should return true when a core member has approved', async () => {
    (octokit.pulls.listReviews as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user1' }
        },
        {
          state: 'CHANGES_REQUESTED',
          user: { login: 'user3' }
        }
      ]
    }));
    const result = await approvalsSatisfied({ teams: 'some-maintainer-team' });
    expect(result).toBe(true);
  });
});
