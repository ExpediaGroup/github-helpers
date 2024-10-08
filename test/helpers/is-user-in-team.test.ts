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

import { isUserInTeam } from '../../src/helpers/is-user-in-team';
import { context } from '@actions/github';
import { octokit } from '../../src/octokit';
import { Mocktokit } from '../types';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 }, actor: 'admin' },
  getOctokit: jest.fn(() => ({ rest: { teams: { listMembersInOrg: jest.fn() } } }))
}));

(octokit.teams.listMembersInOrg as unknown as Mocktokit).mockImplementation(async ({ page, team_slug }) => {
  if (page === 1) {
    return {
      data: team_slug === 'users' ? [{ login: 'octocat' }, { login: 'admin' }] : [{ login: 'admin' }]
    };
  }
  return { data: [] };
});

describe('isUserInTeam', () => {
  const login = 'octocat';

  it('should call isUserInTeam with correct params and find user in team', async () => {
    const response = await isUserInTeam({ login, team: 'users' });
    expect(octokit.teams.listMembersInOrg).toHaveBeenCalledWith({
      org: context.repo.owner,
      page: 1,
      per_page: 100,
      team_slug: 'users'
    });
    expect(response).toBe(true);
  });

  it('should call isUserInTeam with correct params and find user in team for context actor', async () => {
    const response = await isUserInTeam({ team: 'users' });
    expect(octokit.teams.listMembersInOrg).toHaveBeenCalledWith({
      org: context.repo.owner,
      page: 1,
      per_page: 100,
      team_slug: 'users'
    });
    expect(response).toBe(true);
  });

  it('should call isUserInTeam with correct params and find user not in team', async () => {
    const response = await isUserInTeam({ login, team: 'core' });
    expect(octokit.teams.listMembersInOrg).toHaveBeenCalledWith({
      org: context.repo.owner,
      page: 1,
      per_page: 100,
      team_slug: 'core'
    });
    expect(response).toBe(false);
  });
});
