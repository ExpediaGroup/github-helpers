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

import { octokit } from '../octokit';
import { context } from '@actions/github';
import * as core from '@actions/core';
import { sampleSize } from 'lodash';
import { getCoreMemberLogins } from '../utils/get-core-member-logins';
import { map } from 'bluebird';
import { notifyReviewer } from '../utils/notify-reviewer';

interface AssignPrReviewer {
  teams: string;
  pull_number: string;
  login?: string;
  number_of_assignees?: string;
  slack_webhook_url?: string;
}

export const assignPrReviewers = async ({ teams, pull_number, login, number_of_assignees = '1', slack_webhook_url }: AssignPrReviewer) => {
  const coreMemberLogins = await getCoreMemberLogins(teams.split('\n'));

  if (login && coreMemberLogins.includes(login)) {
    core.info('Already a core member, no need to assign.');
    return;
  }
  const assignees = sampleSize(coreMemberLogins, Number(number_of_assignees));

  return octokit.issues
    .addAssignees({
      assignees,
      issue_number: Number(pull_number),
      ...context.repo
    })
    .then(() => {
      if (slack_webhook_url) {
        return map(assignees, assignee => notifyReviewer({ login: assignee, pull_number, slack_webhook_url }));
      }
    });
};
