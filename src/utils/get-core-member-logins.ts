import { octokit } from '../octokit';
import { map } from 'bluebird';
import { context } from '@actions/github';
import { union } from 'lodash';

export const getCoreMemberLogins = async (teams: string[]) => {
  const adminLogins = await map(teams, team =>
    octokit.teams
      .listMembersInOrg({
        org: context.repo.owner,
        team_slug: team,
        per_page: 100
      })
      .then(listMembersResponse => listMembersResponse.data.map(member => member.login))
  );
  return union(...adminLogins);
};
