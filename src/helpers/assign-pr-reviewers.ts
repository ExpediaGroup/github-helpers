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
import { context } from '@actions/github';
import { getCoreMemberLogins } from '../utils/get-core-member-logins';
import { map } from 'bluebird';
import { notifyReviewer } from '../utils/notify-reviewer';
import { octokit } from '../octokit';
import { sampleSize } from 'lodash';

interface AssignPrReviewer {
  teams?: string;
  login?: string;
  number_of_assignees?: string;
  slack_webhook_url?: string;
}

export const assignPrReviewers = async ({ teams, login, number_of_assignees = '1', slack_webhook_url }: AssignPrReviewer) => {
  const coreMemberLogins = await getCoreMemberLogins(context.issue.number, teams?.split('\n'));

  if (login && coreMemberLogins.includes(login)) {
    core.info('Already a core member, no need to assign.');
    return;
  }
  const assignees = sampleSize(coreMemberLogins, Number(number_of_assignees));

  return octokit.issues
    .addAssignees({
      assignees,
      issue_number: context.issue.number,
      ...context.repo
    })
    .then(() => {
      if (slack_webhook_url) {
        return map(assignees, assignee =>
          notifyReviewer({
            login: assignee,
            pull_number: context.issue.number,
            slack_webhook_url
          })
        );
      }
    });
};
