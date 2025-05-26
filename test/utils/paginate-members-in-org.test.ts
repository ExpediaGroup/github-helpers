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

import { paginateMembersInOrg } from '../../src/utils/paginate-members-in-org';
import { MembersInOrg, MembersInOrgParams } from '../../src/types/github';

jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({
    rest: {
      teams: {
        listMembersInOrg: jest.fn(async (args: MembersInOrgParams) => {
          let teamMembers: MembersInOrg = [];
          switch (args.team_slug) {
            case 'empty-team':
              break;
            case 'small-team':
              teamMembers = [
                generateMember({ login: 'user1', id: 1 }),
                generateMember({ login: 'user2', id: 2 }),
                generateMember({ login: 'user3', id: 3 })
              ];
              break;
            case 'large-team':
              const teamSize = 250;
              const page = args.page || 1;
              const pageOffset = (page - 1) * 100;
              const pageSize = Math.min(teamSize - pageOffset, 100);
              for (let i = 0; i < pageSize; i++) {
                teamMembers.push(generateMember({ login: `user${i + pageOffset}`, id: i + pageOffset }));
              }
              break;
          }
          return { data: teamMembers };
        })
      }
    }
  }))
}));

jest.mock('@actions/core', () => ({
  getInput: jest.fn(input => (input === 'input2' ? '' : input))
}));

const generateMember = (baseMember: object): MembersInOrg[number] => {
  return {
    login: 'login',
    id: 0,
    node_id: 'node_id',
    avatar_url: 'avatar_url',
    gravatar_id: 'gravatar_id',
    url: 'url',
    html_url: 'html_url',
    followers_url: 'followers_url',
    following_url: 'following_url',
    gists_url: 'gists_url',
    starred_url: 'starred_url',
    subscriptions_url: 'subscriptions_url',
    organizations_url: 'organizations_url',
    repos_url: 'repos_url',
    events_url: 'events_url',
    received_events_url: 'received_events_url',
    type: 'type',
    site_admin: false,
    ...baseMember
  };
};

describe('paginateMembersInOrg', () => {
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
