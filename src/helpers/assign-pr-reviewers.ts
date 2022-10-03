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
import { context } from '@actions/github';
import { getCoreMemberLogins } from '../utils/get-core-member-logins';
import { map } from 'bluebird';
import { notifyUser } from '../utils/notify-user';
import { octokit } from '../octokit';
import { sampleSize } from 'lodash';
import { CORE_APPROVED_PR_LABEL } from '../constants';

export class AssignPrReviewer extends HelperInputs {
  teams?: string;
  login?: string;
  number_of_assignees?: string;
  slack_webhook_url?: string;
  pull_number?: string;
}

export const assignPrReviewers = async ({
  teams,
  login,
  number_of_assignees = '1',
  slack_webhook_url,
  pull_number = String(context.issue.number)
}: AssignPrReviewer) => {
  const coreMemberLogins = await getCoreMemberLogins(context.issue.number, teams?.split('\n'));
  const {
    data: { user, labels }
  } = await octokit.pulls.get({ pull_number: context.issue.number, ...context.repo });

  if (login && coreMemberLogins.includes(login)) {
    core.info('Already a core member, no need to assign.');
    return;
  }

  if (labels && labels.find(label => label.name === CORE_APPROVED_PR_LABEL)) {
    core.info('Already approved by a core member, no need to assign.');
    return;
  }
  const prAuthorUsername = user?.login;
  const filteredCoreMemberLogins = coreMemberLogins.filter(userName => userName !== prAuthorUsername);
  const assignees = sampleSize(filteredCoreMemberLogins, Number(number_of_assignees));

  await octokit.issues.addAssignees({
    assignees,
    issue_number: Number(pull_number),
    ...context.repo
  });

  if (slack_webhook_url) {
    return map(assignees, async assignee =>
      notifyUser({
        login: assignee,
        pull_number: Number(pull_number),
        slack_webhook_url
      })
    );
  }
};
