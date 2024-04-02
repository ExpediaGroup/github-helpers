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

import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { getRequiredCodeOwnersEntries } from '../utils/get-core-member-logins';
import { map } from 'bluebird';
import { convertToTeamSlug } from '../utils/convert-to-team-slug';
import { CodeOwnersEntry } from 'codeowners-utils';
import * as core from '@actions/core';
import { paginateAllReviews } from '../utils/paginate-all-reviews';

export class ApprovalsSatisfied extends HelperInputs {
  teams?: string;
  users?: string;
  number_of_reviewers?: string;
  pull_number?: string;
}

export const approvalsSatisfied = async ({ teams, users, number_of_reviewers = '1', pull_number }: ApprovalsSatisfied = {}) => {
  const prNumber = pull_number ? Number(pull_number) : context.issue.number;
  const reviews = await paginateAllReviews(prNumber);
  const approverLogins = reviews
    .filter(({ state }) => state === 'APPROVED')
    .map(({ user }) => user?.login)
    .filter(Boolean);
  core.debug(`PR already approved by: ${approverLogins.toString()}`);

  const teamsList = teams?.split('\n');
  const usersList = users?.split('\n');
  const requiredCodeOwnersEntries =
    teamsList || usersList
      ? createArtificialCodeOwnersEntry({ teams: teamsList, users: usersList })
      : await getRequiredCodeOwnersEntries(prNumber);
  const requiredCodeOwnersEntriesWithOwners = requiredCodeOwnersEntries.filter(({ owners }) => owners.length);

  const codeOwnersEntrySatisfiesApprovals = async (entry: Pick<CodeOwnersEntry, 'owners'>) => {
    const loginsLists = await map(entry.owners, async teamOrUser => {
      if (isTeam(teamOrUser)) {
        return await fetchTeamLogins(teamOrUser);
      } else {
        return [teamOrUser];
      }
    });
    const codeOwnerLogins = distinct(loginsLists.flat());

    const numberOfApprovals = approverLogins.filter(login => codeOwnerLogins.includes(login)).length;

    core.debug(`Current number of approvals satisfied for ${entry.owners}: ${numberOfApprovals}`);

    return numberOfApprovals >= Number(number_of_reviewers);
  };

  core.debug(`Required code owners: ${requiredCodeOwnersEntriesWithOwners.map(({ owners }) => owners).toString()}`);
  const booleans = await Promise.all(requiredCodeOwnersEntriesWithOwners.map(codeOwnersEntrySatisfiesApprovals));
  return booleans.every(Boolean);
};

const createArtificialCodeOwnersEntry = ({ teams = [], users = [] }: { teams?: string[]; users?: string[] }) => [
  { owners: teams.concat(users) }
];
const distinct = (arrayWithDuplicates: string[]) => arrayWithDuplicates.filter((n, i) => arrayWithDuplicates.indexOf(n) === i);
const isTeam = (teamOrUser: string) => teamOrUser.includes('/');
const fetchTeamLogins = async (team: string) => {
  const { data } = await octokit.teams.listMembersInOrg({
    org: context.repo.owner,
    team_slug: convertToTeamSlug(team),
    per_page: 100
  });
  return data.map(({ login }) => login);
};
