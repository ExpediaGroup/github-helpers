/*
Copyright 2025 Expedia, Inc.
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

import { describe, it, expect, beforeEach, Mock } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

const { paginateMembersInOrg } = await import('../../src/utils/paginate-members-in-org');
const { octokit } = await import('../../src/octokit');

describe('paginateMembersInOrg', () => {
  beforeEach(() => {
    // Set up mock implementation for listMembersInOrg
    (octokit.teams.listMembersInOrg as unknown as Mock<any>).mockImplementation(async ({ team_slug, page = 1 }: { team_slug: string; page: number }) => {
      if (team_slug === 'empty-team') {
        return { data: [] };
      }

      if (team_slug === 'small-team') {
        return {
          data: [
            { login: 'user1', id: 1 },
            { login: 'user2', id: 2 },
            { login: 'user3', id: 3 }
          ]
        };
      }

      if (team_slug === 'large-team') {
        // Simulate pagination - return 100 items for first two pages, 50 for third
        const startId = (page - 1) * 100;
        const count = page <= 2 ? 100 : 50;
        return {
          data: Array.from({ length: count }, (_, i) => ({
            login: `user${startId + i}`,
            id: startId + i
          }))
        };
      }

      return { data: [] };
    });
  });

  describe('return all team members', () => {
    it('when the team has no members', async () => {
      const response = await paginateMembersInOrg('empty-team');
      expect(response).toEqual([]);
    });

    it('when the team has only a few members', async () => {
      const response = await paginateMembersInOrg('small-team');
      expect(response.length).toBe(3);
      expect(response[0]?.login).toBe('user1');
      expect(response[0]?.id).toBe(1);
    });

    it('when the team has more than 100 members', async () => {
      const response = await paginateMembersInOrg('large-team');
      expect(response.length).toBe(250);
      expect(response[0]?.login).toBe('user0');
      expect(response[0]?.id).toBe(0);
      expect(response[249]?.login).toBe('user249');
      expect(response[249]?.id).toBe(249);
    });
  });
});
