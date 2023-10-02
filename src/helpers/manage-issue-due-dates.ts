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

import { OVERDUE_ISSUE, ALMOST_OVERDUE_ISSUE, PRIORITY_1, PRIORITY_2, PRIORITY_3, PRIORITY_4 } from '../constants';
import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { paginateAllOpenIssues } from '../utils/paginate-open-issues';
import { paginateAllCommentsOnIssue } from '../utils/paginate-comments-on-issue';
import { CommentList, SingleComment, IssueLabels, IssueList } from '../types/github';

type PriorityLabelType = {
  priority_1: string;
  priority_2: string;
  priority_3: string;
  priority_4: string;
};

export class AddOverdueIssueLabel extends HelperInputs {
  /* The threshold (in days) of when to apply the "due soon" label
   * @default 7
   */
  warningThreshold?: number;
  almostOverdueLabel?: string;
  overdueLabel?: string;
  priorityLabels?: PriorityLabelType;
}

export const manageIssueDueDates = async ({
  warningThreshold = 7,
  almostOverdueLabel = ALMOST_OVERDUE_ISSUE,
  overdueLabel = OVERDUE_ISSUE,
  priorityLabels = { priority_1: PRIORITY_1, priority_2: PRIORITY_2, priority_3: PRIORITY_3, priority_4: PRIORITY_4 }
}: AddOverdueIssueLabel) => {
  const openIssues: IssueList = await paginateAllOpenIssues(
    [priorityLabels.priority_1, priorityLabels.priority_2, priorityLabels.priority_3, priorityLabels.priority_4].join()
  );

  const getPriorityLabel = (labels: IssueLabels, priorityLabels: PriorityLabelType) => {
    if (!labels) return '';
    // eslint-disable-next-line functional/no-let
    let index = -1;
    Object.values(priorityLabels).forEach(priority => {
      if (index === -1) {
        index = labels.findIndex(label => (label.name || label) === priority);
      }
    });
    // eslint-disable-next-line functional/no-let
    let priorityLabel = '';
    if (index > -1) {
      const label = labels[index];
      if (typeof label === 'string') priorityLabel = label;
      else priorityLabel = label.name;
    }
    return priorityLabel;
  };

  const addOverdueLabel = (priority: string, date_created: Date, issue_number: number, assignee: string) => {
    const SLAGuidelines = {
      [priorityLabels.priority_1]: 2,
      [priorityLabels.priority_2]: 14,
      [priorityLabels.priority_3]: 45,
      [priorityLabels.priority_4]: 90
    };

    const daysSinceCreation = (Date.now() - date_created.getTime()) / 86400000;

    // eslint-disable-next-line functional/no-let
    let labelToAdd = '';

    if (daysSinceCreation > SLAGuidelines[priority]) labelToAdd = overdueLabel;
    else if (daysSinceCreation > SLAGuidelines[priority] - warningThreshold) labelToAdd = almostOverdueLabel;

    if (labelToAdd.length && assignee.length) {
      octokit.issues.createComment({
        issue_number,
        body: `@${assignee}, this issue assigned to you is now ${labelToAdd.toLowerCase()}`,
        ...context.repo
      });

      return octokit.issues.addLabels({
        labels: [labelToAdd],
        issue_number,
        ...context.repo
      });
    }
  };

  const addDueDateComment = async (deadline: number, createdDate: Date, issue_number: number, hasExistingComments: boolean) => {
    const commentList: CommentList = hasExistingComments ? await paginateAllCommentsOnIssue(issue_number) : [];
    // Create due date comment if there are no existing comments or the comment list does not contain a due date comment
    if (
      !hasExistingComments ||
      commentList.findIndex((comment: SingleComment) => comment.body?.startsWith('This issue is due on')) === -1
    ) {
      const dueDate = new Date(createdDate.getTime() + deadline * 86400000);

      octokit.issues.createComment({
        issue_number,
        body: `This issue is due on ${dueDate.toDateString()}`,
        ...context.repo
      });
    }
  };

  await Promise.all(
    openIssues.map(async issue => {
      const { labels: issueLabels, created_at, assignee, number: issue_number, comments } = issue;
      const priority = getPriorityLabel(issueLabels as IssueLabels, priorityLabels);
      if (priority.length) {
        const createdDate = new Date(created_at);
        const assigneeName: string = typeof assignee === 'string' ? assignee : assignee?.name ?? '';

        const daysOpenBasedOnPriority = {
          [priorityLabels.priority_1]: 2,
          [priorityLabels.priority_2]: 14,
          [priorityLabels.priority_3]: 45,
          [priorityLabels.priority_4]: 90
        };

        addOverdueLabel(priority, createdDate, issue_number, assigneeName);
        await addDueDateComment(daysOpenBasedOnPriority[priority], createdDate, issue_number, comments > 0);
      }
    })
  );
};
