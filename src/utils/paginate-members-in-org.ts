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

import { MembersInOrg } from '../types/github';
import { octokit } from '../octokit';
import { convertToTeamSlug } from './convert-to-team-slug';
import { context } from '@actions/github';

export const paginateMembersInOrg = async (team: string, page: number = 1): Promise<MembersInOrg> => {
  const response = await octokit.teams.listMembersInOrg({
    org: context.repo.owner,
    team_slug: convertToTeamSlug(team),
    per_page: 100,
    page
  });
  if (!response?.data?.length) {
    return [];
  }
  // If the response size is less than 100, we have reached the end of the pagination
  if (response.data.length < 100) {
    return response.data;
  }
  return [...response.data, ...(await paginateMembersInOrg(team, page + 1))];
};
