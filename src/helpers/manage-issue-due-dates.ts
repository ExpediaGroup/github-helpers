/*
Copyright 2023 Expedia, Inc.
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

import { OVERDUE_ISSUE, ALMOST_OVERDUE_ISSUE, PRIORITY_LABELS, PRIORITY_TO_DAYS_MAP, SECONDS_IN_A_DAY } from '../constants';
import { HelperInputs } from '../types/generated';
import { paginateAllOpenIssues } from '../utils/paginate-open-issues';
import { addDueDateComment } from '../utils/add-due-date-comment';
import { IssueList, IssueLabels } from '../types/github';
import { map } from 'bluebird';
import { octokit } from '../octokit';
import { context } from '@actions/github';

export class ManageIssueDueDates extends HelperInputs {
  days?: string;
}

export const manageIssueDueDates = async ({ days = '7' }: ManageIssueDueDates) => {
  const openIssues: IssueList = await paginateAllOpenIssues(PRIORITY_LABELS.join(','));
  const warningThreshold = Number(days);

  const getFirstPriorityLabelFoundOnIssue = (issueLabels: IssueLabels) =>
    PRIORITY_LABELS.find(priorityLabel =>
      issueLabels.some(issueLabel => {
        const labelName = typeof issueLabel === 'string' ? issueLabel : issueLabel.name;
        return labelName === priorityLabel;
      })
    );

  await map(openIssues, async issue => {
    const { labels, created_at, assignee, number: issue_number, comments } = issue;
    const priority = getFirstPriorityLabelFoundOnIssue(labels);
    if (!priority) {
      return;
    }
    const createdDate = new Date(created_at);
    const daysSinceCreation = Math.ceil((Date.now() - createdDate.getTime()) / SECONDS_IN_A_DAY);
    const deadline = PRIORITY_TO_DAYS_MAP[priority];
    const labelToAdd =
      daysSinceCreation > deadline ? OVERDUE_ISSUE : daysSinceCreation > deadline - warningThreshold ? ALMOST_OVERDUE_ISSUE : undefined;
    if (assignee && labelToAdd) {
      await octokit.issues.createComment({
        issue_number,
        body: `@${assignee}, this issue assigned to you is now ${labelToAdd.toLowerCase()}`,
        ...context.repo
      });
    }
    if (labelToAdd) {
      await octokit.issues.addLabels({
        labels: [labelToAdd],
        issue_number,
        ...context.repo
      });
    }
    await addDueDateComment(deadline, createdDate, issue_number, comments);
  });
};
