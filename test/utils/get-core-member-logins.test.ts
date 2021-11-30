import { getCoreMemberLogins } from '../../src/utils/get-core-member-logins';
import { octokit } from '../../src/octokit';
import { context } from '@actions/github';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({
    rest: {
      teams: {
        listMembersInOrg: jest.fn(async (input: any) =>
          input.team_slug === 'team1'
            ? { data: [{ login: 'user1' }, { login: 'user2' }, { login: 'user3' }] }
            : { data: [{ login: 'user3' }, { login: 'user4' }, { login: 'user5' }] }
        )
      }
    }
  }))
}));

const teams = ['team1', 'team2'];

describe('getCoreMemberLogins', () => {
  let result: any;

  beforeEach(async () => {
    result = await getCoreMemberLogins(teams);
  });

  it.each(teams)('should call listMembersInOrg with correct params', (team: string) => {
    expect(octokit.teams.listMembersInOrg).toHaveBeenCalledWith({
      org: context.repo.owner,
      team_slug: team,
      per_page: 100
    });
  });

  it('should return expected result', () => {
    expect(result).toEqual(['user1', 'user2', 'user3', 'user4', 'user5']);
  });
});
