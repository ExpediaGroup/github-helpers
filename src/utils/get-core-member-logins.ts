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

import * as core from '@actions/core';
import { CodeOwnersEntry, loadOwners, matchFile } from 'codeowners-utils';
import { uniq, union } from 'lodash';
import { context } from '@actions/github';
import { getChangedFilepaths } from './get-changed-filepaths';
import { map } from 'bluebird';
import { octokit } from '../octokit';
import { convertToTeamSlug } from './convert-to-team-slug';

export const getCoreMemberLogins = async (pull_number: number, teams?: string[]) => {
  const codeOwners = teams ?? getCodeOwnersFromEntries(await getRequiredCodeOwnersEntries(pull_number));
  const teamsAndLogins = await getCoreTeamsAndLogins(codeOwners);
  return uniq(teamsAndLogins.map(({ login }) => login));
};

export const getRequiredCodeOwnersEntries = async (pull_number: number, codeowners_overrides?: string): Promise<CodeOwnersEntry[]> => {
  let codeOwners: CodeOwnersEntry[] = (await loadOwners(process.cwd())) ?? [];
  if (codeowners_overrides) {
    const unmatchedOverrides: CodeOwnersEntry[] = [];
    codeowners_overrides.split(',').forEach(overrideString => {
      const [pattern, ...owners] = overrideString.split(/\s+/);
      if (!pattern) {
        core.setFailed(
          'Invalid code_owners_override format. Please provide a comma-separated list of lines in GitHub CODEOWNERS format. For example, "/foo @owner1 @owner2,/bar @owner3".'
        );
        throw new Error();
      }
      // Replace exact pattern matches with overrides
      const patternMatched = codeOwners.some((originalEntry, index) => {
        if (originalEntry.pattern === pattern) {
          codeOwners[index] = { pattern, owners };
          return true;
        }
        return false;
      });
      // Queue up unmatched overrides
      if (!patternMatched) {
        unmatchedOverrides.push({ pattern, owners });
      }
    });
    // Append remaining overrides to the end of the list
    // Note: codeowners-utils ordering is the reverse of the CODEOWNERS file
    codeOwners = unmatchedOverrides.toReversed().concat(codeOwners);
  }
  const changedFilePaths = await getChangedFilepaths(pull_number);
  return changedFilePaths.map(filePath => matchFile(filePath, codeOwners)).filter(Boolean);
};

const getCoreTeamsAndLogins = async (codeOwners?: string[]) => {
  if (!codeOwners?.length) {
    core.setFailed('No code owners found. Please provide a "teams" input or set up a CODEOWNERS file in your repo.');
    throw new Error();
  }

  const teamsAndLogins = await map(codeOwners, async team =>
    octokit.teams
      .listMembersInOrg({
        org: context.repo.owner,
        team_slug: team,
        per_page: 100
      })
      .then(listMembersResponse => listMembersResponse.data.map(({ login }) => ({ team, login })))
  );
  return union(...teamsAndLogins);
};

const getCodeOwnersFromEntries = (codeOwnersEntries: CodeOwnersEntry[]) => {
  return uniq<string>(
    codeOwnersEntries
      .map(entry => entry.owners)
      .flat()
      .filter(Boolean)
      .map(codeOwner => convertToTeamSlug(codeOwner))
  );
};
