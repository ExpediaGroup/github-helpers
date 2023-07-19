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
import { getRequiredCodeOwnersEntries } from '../../src/utils/get-core-member-logins';

const ownerMap: { [key: string]: Object } = {
  team1: { data: [{ login: 'user1' }] },
  team2: { data: [{ login: 'user2' }, { login: 'user3' }] },
  team3: { data: [{ login: 'user1' }] },
  team4: { data: [{ login: 'user4' }, { login: 'user5' }] },
  'github-helpers-committers': { data: [{ login: 'user4' }] }
};
jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: {
        listReviews: jest.fn()
      },
      teams: {
        listMembersInOrg: jest.fn(async input => ownerMap[input.team_slug])
      }
    }
  }))
}));
jest.mock('../../src/utils/get-core-member-logins');

describe('approvalsSatisfied', () => {
  it('should return false when a core member has not approved', async () => {
    (getRequiredCodeOwnersEntries as jest.Mock).mockResolvedValue([{ owners: ['@ExpediaGroup/team1'] }]);
    (octokit.pulls.listReviews as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user3' }
        }
      ]
    }));
    const result = await approvalsSatisfied({ teams: 'team1', pull_number: '12345' });
    expect(octokit.pulls.listReviews).toHaveBeenCalledWith({ pull_number: 12345, repo: 'repo', owner: 'owner' });
    expect(getRequiredCodeOwnersEntries).toHaveBeenCalledWith(12345);
    expect(result).toBe(false);
  });

  it('should return true when a core member has approved', async () => {
    (getRequiredCodeOwnersEntries as jest.Mock).mockResolvedValue([{ owners: ['@ExpediaGroup/team1'] }]);
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
    const result = await approvalsSatisfied();
    expect(result).toBe(true);
  });

  it('should return false when not all core teams have approved', async () => {
    (getRequiredCodeOwnersEntries as jest.Mock).mockResolvedValue([
      { owners: ['@ExpediaGroup/team1'] },
      { owners: ['@ExpediaGroup/team2'] },
      { owners: ['@ExpediaGroup/team3'] }
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
    const result = await approvalsSatisfied();
    expect(result).toBe(false);
  });

  it('should return true when a member from each core team has approved', async () => {
    (getRequiredCodeOwnersEntries as jest.Mock).mockResolvedValue([
      { owners: ['@ExpediaGroup/team1'] },
      { owners: ['@ExpediaGroup/team2'] },
      { owners: ['@ExpediaGroup/team3'] }
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
    const result = await approvalsSatisfied();
    expect(result).toBe(true);
  });

  it('should return false when not enough members from core teams have approved', async () => {
    (getRequiredCodeOwnersEntries as jest.Mock).mockResolvedValue([
      { owners: ['@ExpediaGroup/team2'] },
      { owners: ['@ExpediaGroup/team4'] }
    ]);
    (octokit.pulls.listReviews as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user2' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user3' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user4' }
        }
      ]
    }));
    const result = await approvalsSatisfied({ number_of_reviewers: '2' });
    expect(result).toBe(false);
  });

  it('should return true when enough members from core teams have approved', async () => {
    (getRequiredCodeOwnersEntries as jest.Mock).mockResolvedValue([
      { owners: ['@ExpediaGroup/team2'] },
      { owners: ['@ExpediaGroup/team4'] }
    ]);
    (octokit.pulls.listReviews as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user2' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user3' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user4' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user5' }
        }
      ]
    }));
    const result = await approvalsSatisfied({ number_of_reviewers: '2' });
    expect(result).toBe(true);
  });
});
