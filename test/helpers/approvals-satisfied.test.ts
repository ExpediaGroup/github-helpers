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
import { getCoreTeamsAndLogins } from '../../src/utils/get-core-member-logins';

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

describe('approvalsSatisfied', () => {
  it('should return false when a core member has not approved', async () => {
    (getCoreTeamsAndLogins as jest.Mock).mockResolvedValue([
      {
        team: 'team1',
        login: 'user1'
      }
    ]);
    (octokit.pulls.listReviews as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user3' }
        }
      ]
    }));
    const result = await approvalsSatisfied({ teams: 'team1' });
    expect(result).toBe(false);
  });

  it('should return true when a core member has approved', async () => {
    (getCoreTeamsAndLogins as jest.Mock).mockResolvedValue([
      {
        team: 'team1',
        login: 'user1'
      }
    ]);
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
    const result = await approvalsSatisfied({ teams: 'team1' });
    expect(result).toBe(true);
  });

  it('should return false when not all core teams have approved', async () => {
    (getCoreTeamsAndLogins as jest.Mock).mockResolvedValue([
      {
        team: 'team1',
        login: 'user1'
      },
      {
        team: 'team2',
        login: 'user2'
      },
      {
        team: 'team2',
        login: 'user3'
      },
      {
        team: 'team3',
        login: 'user1'
      }
    ]);
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
    const result = await approvalsSatisfied({ teams: 'team1\nteam2' });
    expect(result).toBe(false);
  });

  it('should return true when a member from each core team has approved', async () => {
    (getCoreTeamsAndLogins as jest.Mock).mockResolvedValue([
      {
        team: 'team1',
        login: 'user1'
      },
      {
        team: 'team2',
        login: 'user2'
      },
      {
        team: 'team2',
        login: 'user3'
      },
      {
        team: 'team3',
        login: 'user1'
      }
    ]);
    (octokit.pulls.listReviews as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user1' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user2' }
        },
        {
          state: 'CHANGES_REQUESTED',
          user: { login: 'user3' }
        }
      ]
    }));
    const result = await approvalsSatisfied({ teams: 'team1\nteam2\nteam3' });
    expect(result).toBe(true);
  });
});
