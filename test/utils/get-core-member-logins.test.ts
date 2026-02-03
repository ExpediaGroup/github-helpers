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

import { describe, it, expect, beforeEach, afterEach, Mock, spyOn } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

const ownerMap: { [key: string]: { data: { login: string }[] } } = {
  'test-owners-1': { data: [{ login: 'user1' }, { login: 'user2' }] },
  'test-owners-2': { data: [{ login: 'user2' }, { login: 'user3' }] },
  'test-shared-owners-1': { data: [{ login: 'user4' }, { login: 'user5' }] },
  'test-shared-owners-2': { data: [{ login: 'user5' }, { login: 'user6' }] },
  'github-helpers-committers': { data: [{ login: 'user4' }] }
};

const { getCoreMemberLogins, getRequiredCodeOwnersEntries } = await import('../../src/utils/get-core-member-logins');
const { octokit } = await import('../../src/octokit');
const paginateMembersInOrgModule = await import('../../src/utils/paginate-members-in-org');

const file1 = 'file/path/1/file1.txt';
const file2 = 'file/path/2/file2.ts';
const sharedFile = 'file/path/shared/file.ts';
const someTotallyDifferentFile = 'something/totally/different/file1.txt';
const pkg = 'package.json';

const pull_number = 123;

describe('getCoreMemberLogins', () => {
  describe('codeowners tests', () => {
    let paginateMembersInOrgSpy: ReturnType<typeof spyOn>;

    beforeEach(() => {
      paginateMembersInOrgSpy = spyOn(paginateMembersInOrgModule, 'paginateMembersInOrg').mockImplementation(async (team: string) => {
        const teamSlug = team.replace('@ExpediaGroup/', '').replace('ExpediaGroup/', '');
        return (ownerMap[teamSlug]?.data || []) as any;
      });
    });

    afterEach(() => {
      paginateMembersInOrgSpy.mockRestore();
    });

    describe('only some codeowners case', () => {
      beforeEach(() => {
        (octokit.pulls.listFiles as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
          data:
            page === 1
              ? [
                  {
                    filename: file1
                  },
                  {
                    filename: file2
                  }
                ]
              : []
        }));
      });

      it('should return expected result', async () => {
        const result = await getCoreMemberLogins({ pull_number });

        expect(result).toEqual(['user1', 'user2', 'user3']);
      });
    });

    describe('all codeowners case', () => {
      beforeEach(() => {
        (octokit.pulls.listFiles as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
          data:
            page === 1
              ? [
                  {
                    filename: file1
                  },
                  {
                    filename: file2
                  },
                  {
                    filename: someTotallyDifferentFile
                  },
                  {
                    filename: pkg
                  }
                ]
              : []
        }));
      });

      it('should return expected result', async () => {
        const result = await getCoreMemberLogins({ pull_number });

        expect(result).toEqual(['user1', 'user2', 'user3', 'user4']);
      });
    });

    describe('getRequiredCodeOwnersEntries', () => {
      beforeEach(() => {
        (octokit.pulls.listFiles as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
          data:
            page === 1
              ? [
                  {
                    filename: 'new/entry/1/file.ts'
                  },
                  {
                    filename: file1
                  },
                  {
                    filename: sharedFile
                  },
                  {
                    filename: 'file/path/users/file.ts'
                  }
                ]
              : []
        }));
      });

      it('should return CODEOWNERS entries for changed files', async () => {
        const result = await getRequiredCodeOwnersEntries(pull_number);

        expect(result).toEqual([
          {
            pattern: '*',
            owners: ['@ExpediaGroup/github-helpers-committers']
          },
          {
            pattern: '/file/path/1',
            owners: ['@ExpediaGroup/test-owners-1']
          },
          {
            pattern: '/file/path/shared',
            owners: ['@ExpediaGroup/test-shared-owners-1', '@ExpediaGroup/test-shared-owners-2']
          },
          {
            pattern: '/file/path/users',
            owners: ['@user1', '@user2']
          }
        ]);
      });

      it('should allow CODEOWNERS overrides via codeowners_overrides, replacing existing entries and appending new ones', async () => {
        const result = await getRequiredCodeOwnersEntries(
          pull_number,
          '/file/path/1/file1.txt @specific-override1 @specific-override2,/new/entry/1 @newowner1,/file/path/shared,/new/entry/2 @newowner2'
        );

        expect(result).toEqual([
          {
            pattern: '/new/entry/1',
            owners: ['@newowner1']
          },
          {
            pattern: '/file/path/1/file1.txt',
            owners: ['@specific-override1', '@specific-override2']
          },
          {
            pattern: '/file/path/shared',
            owners: []
          },
          {
            pattern: '/file/path/users',
            owners: ['@user1', '@user2']
          }
        ]);
      });
    });
  });

  describe('specified teams case', () => {
    const teams = ['test-owners-1', 'test-owners-2'];
    let paginateMembersInOrgSpy: ReturnType<typeof spyOn>;

    beforeEach(() => {
      paginateMembersInOrgSpy = spyOn(paginateMembersInOrgModule, 'paginateMembersInOrg').mockImplementation(async (team: string) => {
        const teamSlug = team.replace('@ExpediaGroup/', '').replace('ExpediaGroup/', '');
        return (ownerMap[teamSlug]?.data || []) as any;
      });
      (octokit.pulls.listFiles as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data:
          page === 1
            ? [
                {
                  filename: file1
                },
                {
                  filename: file2
                },
                {
                  filename: someTotallyDifferentFile
                },
                {
                  filename: pkg
                }
              ]
            : []
      }));
    });

    afterEach(() => {
      paginateMembersInOrgSpy.mockRestore();
    });

    it('should return expected result', async () => {
      const result = await getCoreMemberLogins({ pull_number, teams });

      expect(result).toEqual(['user1', 'user2', 'user3']);
    });
  });
});
