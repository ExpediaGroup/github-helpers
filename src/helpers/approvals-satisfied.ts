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
import { getCoreTeamsAndLogins } from '../utils/get-core-member-logins';
import { groupBy, uniq } from 'lodash';

export class ApprovalsSatisfied extends HelperInputs {
  teams?: string;
}

export const approvalsSatisfied = async ({ teams }: ApprovalsSatisfied = {}) => {
  const { data: reviews } = await octokit.pulls.listReviews({ pull_number: context.issue.number, ...context.repo });
  const teamsAndLogins = await getCoreTeamsAndLogins(context.issue.number, teams?.split('\n'));
  const approverLogins = reviews
    .filter(({ state }) => state === 'APPROVED')
    .map(({ user }) => user?.login)
    .filter(Boolean);
  const codeOwnerTeams = uniq(teamsAndLogins.map(({ team }) => team));

  return codeOwnerTeams.every(team => {
    const membersOfCodeOwnerTeam = groupBy(teamsAndLogins, 'team')[team];
    return membersOfCodeOwnerTeam.some(({ login }) => approverLogins.includes(login));
  });
};
