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
import { getCoreMemberLogins, getRequiredCodeOwnersEntries } from '../../src/utils/get-core-member-logins';
import { octokit } from '../../src/octokit';

jest.mock('@actions/core');
const ownerMap: { [key: string]: { data: { login: string }[] } } = {
  'test-owners-1': { data: [{ login: 'user1' }, { login: 'user2' }] },
  'test-owners-2': { data: [{ login: 'user2' }, { login: 'user3' }] },
  'test-shared-owners-1': { data: [{ login: 'user4' }, { login: 'user5' }] },
  'test-shared-owners-2': { data: [{ login: 'user5' }, { login: 'user6' }] },
  'github-helpers-committers': { data: [{ login: 'user4' }] }
};
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: { listFiles: jest.fn() },
      teams: {
        listMembersInOrg: jest.fn(async input => ownerMap[input.team_slug])
      }
    }
  }))
}));
const file1 = 'file/path/1/file1.txt';
const file2 = 'file/path/2/file2.ts';
const sharedFile = 'file/path/shared/file.ts';
const someTotallyDifferentFile = 'something/totally/different/file1.txt';
const pkg = 'package.json';

const pull_number = 123;

describe('getCoreMemberLogins', () => {
  describe('codeowners tests', () => {
    describe('only some codeowners case', () => {
      beforeEach(() => {
        (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
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
        const result = await getCoreMemberLogins(pull_number);

        expect(result).toEqual(['user1', 'user2', 'user3']);
      });
    });

    describe('all codeowners case', () => {
      beforeEach(() => {
        (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
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
        const result = await getCoreMemberLogins(pull_number);

        expect(result).toEqual(['user1', 'user2', 'user3', 'user4']);
      });
    });

    describe('getRequiredCodeOwnersEntries', () => {
      beforeEach(() => {
        (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
          data:
            page === 1
              ? [
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

      it('should return expected result', async () => {
        const result = await getRequiredCodeOwnersEntries(pull_number);

        expect(result).toEqual([
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
    });
  });

  describe('specified teams case', () => {
    const teams = ['test-owners-1', 'test-owners-2'];

    beforeEach(() => {
      (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
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
      const result = await getCoreMemberLogins(pull_number, teams);

      expect(result).toEqual(['user1', 'user2', 'user3']);
    });
  });
});
