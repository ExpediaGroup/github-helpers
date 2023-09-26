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
import { PRIORITY_1, PRIORITY_2, PRIORITY_3, PRIORITY_4 } from '../constants';

export class CreateIssueDuedateComment extends HelperInputs {
  label?: string;
}

export const commentIssueDueDate = async ({ label }: CreateIssueDuedateComment) => {
  const issue_number = context.issue.number;

  // eslint-disable-next-line functional/no-let
  let numDaysAllowedOpen;
  switch (label) {
    case PRIORITY_1:
      numDaysAllowedOpen = 2;
      break;
    case PRIORITY_2:
      numDaysAllowedOpen = 14;
      break;
    case PRIORITY_3:
      numDaysAllowedOpen = 45;
      break;
    case PRIORITY_4:
      numDaysAllowedOpen = 90;
      break;
  }

  if (!numDaysAllowedOpen) return;

  const response = await octokit.issues.get({
    issue_number,
    ...context.repo
  });

  const issue = response.data;

  const dateCreated = new Date(issue.created_at);
  // format will be day month date year (ex: Mon Dec 25 2023)
  const dueDate = new Date(dateCreated.getTime() + numDaysAllowedOpen * 86400000);

  return octokit.issues.createComment({
    body: `This issue is due on ${dueDate.toDateString()}`,
    issue_number,
    ...context.repo
  });
};
