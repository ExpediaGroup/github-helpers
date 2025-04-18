/*
Copyright 2023 Expedia, Inc.
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

import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import * as core from '@actions/core';
import { MembersInOrg } from '../types/github';

export class IsUserInTeam extends HelperInputs {
  team = '';
  declare login?: string;
}

export const isUserInTeam = async ({ login = context.actor, team }: IsUserInTeam) => {
  const members = await paginateAllMembersInOrg(team);
  core.info(`Checking if ${login} is in team ${team}`);
  core.info(`Team members: ${members.map(({ login }) => login).join(', ')}`);
  return members.some(({ login: memberLogin }) => memberLogin === login);
};

async function paginateAllMembersInOrg(team: string, page = 1): Promise<MembersInOrg> {
  const response = await octokit.teams.listMembersInOrg({
    org: context.repo.owner,
    team_slug: team,
    page,
    per_page: 100
  });
  if (!response.data.length) {
    return [];
  }
  return response.data.concat(await paginateAllMembersInOrg(team, page + 1));
}
