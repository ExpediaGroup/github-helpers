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
import { union, uniq } from 'lodash';
import { context } from '@actions/github';
import { getChangedFilepaths } from './get-changed-filepaths';
import { map } from 'bluebird';
import { octokit } from '../octokit';

export const getCoreMemberLogins = async (pull_number: number, teams?: string[]) => {
  const codeOwners = teams ?? (await getCodeOwners(pull_number));

  if (!codeOwners?.length) {
    core.setFailed('No code owners found.');
    throw new Error();
  }

  const adminLogins = await map(codeOwners, team =>
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

const getCodeOwners = async (pull_number: number) => {
  const codeOwners = (await loadOwners(process.cwd())) ?? [];
  const changedFilePaths = await getChangedFilepaths(pull_number);
  const matchingCodeOwners = changedFilePaths.map(filePath => matchFile(filePath, codeOwners) ?? ({} as CodeOwnersEntry));
  return uniq(
    matchingCodeOwners
      .map(owner => owner.owners)
      .flat()
      .filter(Boolean)
      .map(owner => owner.substring(owner.indexOf('/') + 1))
  );
};
