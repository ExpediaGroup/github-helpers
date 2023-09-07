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
import { HelperInputs } from '../types/generated';
import { getRequiredCodeOwnersEntries } from '../utils/get-core-member-logins';
import { context } from '@actions/github';

export class AreReviewersRequired extends HelperInputs {
  teams = '';
}

export const areReviewersRequired = async ({ teams }: AreReviewersRequired) => {
  const prNumber = context.issue.number;
  const teamsList = teams?.split('\n');
  const requiredCodeOwnersEntries = (await getRequiredCodeOwnersEntries(prNumber)).map(({ owners }) => owners).flat();
  const notRequiredTeams = teamsList.filter(team => !requiredCodeOwnersEntries.includes(team));
  if (notRequiredTeams.length) {
    core.info(`${notRequiredTeams.join(', ')} not in list of required reviewers`);
    return false;
  }
  return true;
};
