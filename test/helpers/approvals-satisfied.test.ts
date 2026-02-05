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

import { Mock, beforeEach, afterEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

const ownerMap: { [key: string]: { data: { login: string }[] } } = {
  team1: { data: [{ login: 'user1' }] },
  team2: { data: [{ login: 'user2' }, { login: 'user3' }] },
  team3: { data: [{ login: 'user1' }] },
  team4: { data: [{ login: 'user4' }, { login: 'user5' }] },
  team5: { data: [{ login: 'user4' }, { login: 'user6' }, { login: 'user7' }] },
  team6: { data: [{ login: 'user8' }, { login: 'user9' }] }
};

const { approvalsSatisfied } = await import('../../src/helpers/approvals-satisfied');
const { octokit } = await import('../../src/octokit');
const getCoreMemberLoginsModule = await import('../../src/utils/get-core-member-logins');
const paginateMembersInOrgModule = await import('../../src/utils/paginate-members-in-org');
const core = await import('@actions/core');

const mockPagination = (result: unknown) => {
  (octokit.pulls.listReviews as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => {
    return page === 1 ? result : { data: [] };
  });
};

describe('approvalsSatisfied', () => {
  let paginateMembersInOrgSpy: ReturnType<typeof spyOn>;
  let getRequiredCodeOwnersEntriesSpy: ReturnType<typeof spyOn>;
  let getCoreMemberLoginsSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    mock.clearAllMocks();
    paginateMembersInOrgSpy = spyOn(paginateMembersInOrgModule, 'paginateMembersInOrg').mockImplementation(async (team: string) => {
      const teamSlug = team.replace('@ExpediaGroup/', '').replace('ExpediaGroup/', '').replace('owner/', '');
      return (ownerMap[teamSlug]?.data || []) as any;
    });
    getRequiredCodeOwnersEntriesSpy = spyOn(getCoreMemberLoginsModule, 'getRequiredCodeOwnersEntries').mockResolvedValue([]);
    getCoreMemberLoginsSpy = spyOn(getCoreMemberLoginsModule, 'getCoreMemberLogins').mockResolvedValue([]);
  });

  afterEach(() => {
    paginateMembersInOrgSpy.mockRestore();
    getRequiredCodeOwnersEntriesSpy.mockRestore();
    getCoreMemberLoginsSpy.mockRestore();
  });

  it('should return false when passing teams override and required approvals are not met', async () => {
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user3' }
        }
      ]
    });

    const result = await approvalsSatisfied({ teams: 'team1', pull_number: '12345' });
    expect(octokit.pulls.listReviews).toHaveBeenCalledWith({ pull_number: 12345, repo: 'repo', owner: 'owner', page: 1, per_page: 100 });
    expect(getCoreMemberLoginsModule.getRequiredCodeOwnersEntries).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should return true when passing teams override and required approvals are met', async () => {
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user1' }
        }
      ]
    });
    const result = await approvalsSatisfied({ teams: 'team1', pull_number: '12345' });
    expect(octokit.pulls.listReviews).toHaveBeenCalledWith({ pull_number: 12345, repo: 'repo', owner: 'owner', page: 1, per_page: 100 });
    expect(getCoreMemberLoginsModule.getRequiredCodeOwnersEntries).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should throw an error when passing teams override with full name and org is different than repo org', async () => {
    const result = await approvalsSatisfied({ teams: 'owner/team2\nsomeOtherOrg/team1', pull_number: '12345' });
    expect(getCoreMemberLoginsModule.getRequiredCodeOwnersEntries).not.toHaveBeenCalled();
    expect(core.setFailed).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should return true when passing teams override and collective required approvals are met across multiple teams', async () => {
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user1' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user2' }
        }
      ]
    });
    const result = await approvalsSatisfied({ teams: 'team1\nteam2', pull_number: '12345', number_of_reviewers: '2' });
    expect(octokit.pulls.listReviews).toHaveBeenCalledWith({ pull_number: 12345, repo: 'repo', owner: 'owner', page: 1, per_page: 100 });
    expect(getCoreMemberLoginsModule.getRequiredCodeOwnersEntries).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return false when passing users override and required approvals are not met', async () => {
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user3' }
        }
      ]
    });

    const result = await approvalsSatisfied({ users: 'user1', pull_number: '12345' });
    expect(octokit.pulls.listReviews).toHaveBeenCalledWith({ pull_number: 12345, repo: 'repo', owner: 'owner', page: 1, per_page: 100 });
    expect(getCoreMemberLoginsModule.getRequiredCodeOwnersEntries).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should return true when passing users override and required approvals are met', async () => {
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user1' }
        }
      ]
    });
    const result = await approvalsSatisfied({ users: 'user1', pull_number: '12345' });
    expect(octokit.pulls.listReviews).toHaveBeenCalledWith({ pull_number: 12345, repo: 'repo', owner: 'owner', page: 1, per_page: 100 });
    expect(getCoreMemberLoginsModule.getRequiredCodeOwnersEntries).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return true when passing users override and required approvals are met when count > 1', async () => {
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user1' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user3' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user5' }
        }
      ]
    });
    const result = await approvalsSatisfied({ users: 'user1\nuser2\nuser3', pull_number: '12345', number_of_reviewers: '2' });
    expect(octokit.pulls.listReviews).toHaveBeenCalledWith({ pull_number: 12345, repo: 'repo', owner: 'owner', page: 1, per_page: 100 });
    expect(getCoreMemberLoginsModule.getRequiredCodeOwnersEntries).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return true when passing users and teams override and required approvals are met when count > 1', async () => {
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user1' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user3' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user5' }
        }
      ]
    });
    const result = await approvalsSatisfied({
      users: 'user4\nuser2\nuser3',
      teams: 'team1',
      pull_number: '12345',
      number_of_reviewers: '2'
    });
    expect(octokit.pulls.listReviews).toHaveBeenCalledWith({ pull_number: 12345, repo: 'repo', owner: 'owner', page: 1, per_page: 100 });
    expect(getCoreMemberLoginsModule.getRequiredCodeOwnersEntries).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return false when a core member has not approved', async () => {
    getRequiredCodeOwnersEntriesSpy.mockResolvedValue([{ owners: ['@ExpediaGroup/team1'] }]);
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user3' }
        }
      ]
    });
    const result = await approvalsSatisfied({ pull_number: '12345' });
    expect(octokit.pulls.listReviews).toHaveBeenCalledWith({ pull_number: 12345, repo: 'repo', owner: 'owner', page: 1, per_page: 100 });
    expect(getCoreMemberLoginsModule.getRequiredCodeOwnersEntries).toHaveBeenCalledWith(12345, undefined);
    expect(result).toBe(false);
  });

  it('should return true when a member from the team specified in codeowners_overrides has approved', async () => {
    getRequiredCodeOwnersEntriesSpy.mockResolvedValue([{ owners: ['@ExpediaGroup/team6'] }]);
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user9' }
        }
      ]
    });
    const codeOwnersOverrides = '* @ExpediaGroup/team6';
    const result = await approvalsSatisfied({ pull_number: '12345', codeowners_overrides: codeOwnersOverrides });
    expect(octokit.pulls.listReviews).toHaveBeenCalledWith({ pull_number: 12345, repo: 'repo', owner: 'owner', page: 1, per_page: 100 });
    expect(getCoreMemberLoginsModule.getRequiredCodeOwnersEntries).toHaveBeenCalledWith(12345, codeOwnersOverrides);
    expect(result).toBe(true);
  });

  it('should return true when a core member has approved', async () => {
    getRequiredCodeOwnersEntriesSpy.mockResolvedValue([{ owners: ['@ExpediaGroup/team1'] }]);
    mockPagination({
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
    });
    const result = await approvalsSatisfied();
    expect(result).toBe(true);
  });

  it('should return false when not all core teams have approved', async () => {
    getRequiredCodeOwnersEntriesSpy.mockResolvedValue([
      { owners: ['@ExpediaGroup/team1'] },
      { owners: ['@ExpediaGroup/team2'] },
      { owners: ['@ExpediaGroup/team3'] }
    ]);
    mockPagination({
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
    });
    const result = await approvalsSatisfied();
    expect(result).toBe(false);
  });

  it('should return true when a member from each core team has approved', async () => {
    getRequiredCodeOwnersEntriesSpy.mockResolvedValue([
      { owners: ['@ExpediaGroup/team1'] },
      { owners: ['@ExpediaGroup/team2'] },
      { owners: ['@ExpediaGroup/team3'] }
    ]);
    mockPagination({
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
    });
    const result = await approvalsSatisfied();
    expect(result).toBe(true);
  });

  it('should return true when a member from each owner group (teams and users) has approved', async () => {
    getRequiredCodeOwnersEntriesSpy.mockResolvedValue([
      { owners: ['@ExpediaGroup/team1'] },
      { owners: ['@ExpediaGroup/team2'] },
      { owners: ['@ExpediaGroup/team4', 'user10'] }
    ]);
    mockPagination({
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
        },
        {
          state: 'APPROVED',
          user: { login: 'user10' }
        }
      ]
    });
    const result = await approvalsSatisfied();
    expect(result).toBe(true);
  });

  it('should return false when not enough members from core teams have approved', async () => {
    getRequiredCodeOwnersEntriesSpy.mockResolvedValue([{ owners: ['@ExpediaGroup/team2'] }, { owners: ['@ExpediaGroup/team4'] }]);
    mockPagination({
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
    });
    const result = await approvalsSatisfied({ number_of_reviewers: '2' });
    expect(result).toBe(false);
  });

  it('should return true when enough members from core teams have approved', async () => {
    getRequiredCodeOwnersEntriesSpy.mockResolvedValue([{ owners: ['@ExpediaGroup/team2'] }, { owners: ['@ExpediaGroup/team4'] }]);
    mockPagination({
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
    });
    const result = await approvalsSatisfied({ number_of_reviewers: '2' });
    expect(result).toBe(true);
  });

  it('should return false when not enough collective approvals from shared owners are met', async () => {
    getRequiredCodeOwnersEntriesSpy.mockResolvedValue([{ owners: ['@ExpediaGroup/team4', '@ExpediaGroup/team5'] }]);
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user4' }
        }
      ]
    });
    const result = await approvalsSatisfied({ number_of_reviewers: '2' });
    expect(result).toBe(false);
  });

  it('should return false when not enough collective approvals from shared owners are met even if user is in both groups', async () => {
    getRequiredCodeOwnersEntriesSpy.mockResolvedValue([{ owners: ['@ExpediaGroup/team4', '@ExpediaGroup/team5'] }]);
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user5' }
        }
      ]
    });
    const result = await approvalsSatisfied({ number_of_reviewers: '2' });
    expect(result).toBe(false);
  });

  it('should return true when enough collective approvals from shared owners are met', async () => {
    getRequiredCodeOwnersEntriesSpy.mockResolvedValue([{ owners: ['@ExpediaGroup/team4', '@ExpediaGroup/team5'] }]);
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user4' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user6' }
        }
      ]
    });
    const result = await approvalsSatisfied({ number_of_reviewers: '2' });
    expect(result).toBe(true);
  });

  it('should return false when collective approvals are met but not standalone approvals', async () => {
    getRequiredCodeOwnersEntriesSpy.mockResolvedValue([
      { owners: ['@ExpediaGroup/team4'] },
      { owners: ['@ExpediaGroup/team5', '@ExpediaGroup/team6'] }
    ]);
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user4' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user8' }
        }
      ]
    });
    const result = await approvalsSatisfied({ number_of_reviewers: '2' });
    expect(result).toBe(false);
  });

  it('should return true when both collective and standalone approvals are met', async () => {
    getRequiredCodeOwnersEntriesSpy.mockResolvedValue([
      { owners: ['@ExpediaGroup/team4'] },
      { owners: ['@ExpediaGroup/team5', '@ExpediaGroup/team6'] }
    ]);
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user4' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user5' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user8' }
        }
      ]
    });
    const result = await approvalsSatisfied({ number_of_reviewers: '2' });
    expect(result).toBe(true);
  });

  it('should return true when there are no code owners for one file and the other file is satisfied', async () => {
    getRequiredCodeOwnersEntriesSpy.mockResolvedValue([{ owners: [] }, { owners: ['@ExpediaGroup/team5', '@ExpediaGroup/team6'] }]);
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user4' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user5' }
        },
        {
          state: 'APPROVED',
          user: { login: 'user8' }
        }
      ]
    });
    const result = await approvalsSatisfied({ number_of_reviewers: '2' });
    expect(result).toBe(true);
  });

  it('should return false when there are no code owners for one file and the other file is not satisfied', async () => {
    getRequiredCodeOwnersEntriesSpy.mockResolvedValue([{ owners: [] }, { owners: ['@ExpediaGroup/team5', '@ExpediaGroup/team6'] }]);
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user4' }
        }
      ]
    });
    const result = await approvalsSatisfied({ number_of_reviewers: '2' });
    expect(result).toBe(false);
  });

  it('should return true when the overridden team config is satisfied', async () => {
    getRequiredCodeOwnersEntriesSpy.mockResolvedValue([
      { owners: ['@ExpediaGroup/team1'] },
      { owners: ['@ExpediaGroup/team2'] },
      { owners: ['@ExpediaGroup/team3'] }
    ]);
    mockPagination({
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
          state: 'APPROVED',
          user: { login: 'user3' }
        }
      ]
    });
    const result = await approvalsSatisfied({
      number_of_reviewers: '2',
      required_review_overrides: '@ExpediaGroup/team1:1,@ExpediaGroup/team3:1'
    });
    expect(result).toBe(true);
  });

  it('should return true when passing comma-seperated list of users and approvals are met', async () => {
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user1' }
        }
      ]
    });
    const result = await approvalsSatisfied({
      users: '@user1,@user2',
      pull_number: '12345'
    });
    expect(octokit.pulls.listReviews).toHaveBeenCalledWith({ pull_number: 12345, repo: 'repo', owner: 'owner', page: 1, per_page: 100 });
    expect(getCoreMemberLoginsModule.getRequiredCodeOwnersEntries).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return false when passing comma-seperated list of users and approvals are not met', async () => {
    mockPagination({
      data: [
        {
          state: 'APPROVED',
          user: { login: 'user3' }
        }
      ]
    });
    const result = await approvalsSatisfied({
      users: '@user1,@user2',
      pull_number: '12345'
    });
    expect(octokit.pulls.listReviews).toHaveBeenCalledWith({ pull_number: 12345, repo: 'repo', owner: 'owner', page: 1, per_page: 100 });
    expect(getCoreMemberLoginsModule.getRequiredCodeOwnersEntries).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should return true when approvals are satisfied and users are explicitly defined in CODEOWNERS', async () => {
    getRequiredCodeOwnersEntriesSpy.mockResolvedValue([{ owners: ['@user1', '@user2'] }]);
    mockPagination({
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
          state: 'APPROVED',
          user: { login: 'user3' }
        }
      ]
    });
    const result = await approvalsSatisfied({
      number_of_reviewers: '2'
    });
    expect(result).toBe(true);
  });

  describe('pr comments', () => {
    it('should not make pr comment when approvals not satisfied and no body', async () => {
      mockPagination({
        data: [
          {
            state: 'APPROVED',
            user: { login: 'user3' }
          }
        ]
      });
      await approvalsSatisfied({
        users: '@user1,@user2',
        pull_number: '12345'
      });
      expect(octokit.issues.createComment).not.toHaveBeenCalled();
    });

    it('should make pr comment including approvalsNotMetMessage when it is passed and approvals not satisfied', async () => {
      mockPagination({
        data: [
          {
            state: 'APPROVED',
            user: { login: 'user3' }
          },
          {
            state: 'APPROVED',
            user: { login: 'user4' }
          }
        ]
      });
      await approvalsSatisfied({
        users: '@user1,@user2',
        pull_number: '12345',
        body: 'PRs must meet all required approvals before entering the merge queue.'
      });
      expect(octokit.issues.createComment).toHaveBeenCalledWith(
        expect.objectContaining({
          body: `PRs must meet all required approvals before entering the merge queue.

Required approvals not satisfied:

PR already approved by: \`user3\`, \`user4\`
Required code owners: \`user1\`, \`user2\`
Current number of approvals satisfied for \`user1\`,\`user2\`: 0
Number of required reviews: 1`
        })
      );
    });
  });
});
