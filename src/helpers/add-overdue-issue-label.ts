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
import { paginateAllOpenIssues } from '../../src/utils/paginate-open-issues';
import { IssueLabels, IssueList } from '../types/github';
import { map } from 'bluebird';

export class AddOverdueIssueLabel extends HelperInputs {
  /* The threshold (in days) of when to apply the "due soon" label
   * @default 7
   */
  warningThreshold?: number;
  almostOverdueLabel?: string;
  overdueLabel?: string;
  priorityLabels?: PriorityLabelType;
}

export const addOverdueIssueLabel = async ({
  warningThreshold = 7,
  almostOverdueLabel = ALMOST_OVERDUE_ISSUE,
  overdueLabel = OVERDUE_ISSUE,
  priorityLabels = { priority_1: PRIORITY_1, priority_2: PRIORITY_2, priority_3: PRIORITY_3, priority_4: PRIORITY_4 }
}: AddOverdueIssueLabel) => {
  const openIssues: IssueList = await paginateAllOpenIssues(
    [priorityLabels.priority_1, priorityLabels.priority_2, priorityLabels.priority_3, priorityLabels.priority_4].join()
  );

  return map(openIssues, issue => {
    const { labels: issueLabels, created_at, assignee, number: issue_number } = issue;
    const priority = issueLabels && getPriorityLabel(issueLabels as IssueLabels, priorityLabels);
    if (!priority) return;

    const labelToAdd = isOverdue(priority, new Date(created_at), warningThreshold, overdueLabel, almostOverdueLabel, priorityLabels);

    if (!labelToAdd) return;

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
  });
};

type PriorityLabelType = {
  priority_1: string;
  priority_2: string;
  priority_3: string;
  priority_4: string;
};

const getPriorityLabel = (labels: IssueLabels, priorityLabels: PriorityLabelType) => {
  if (labels.find(label => (label.name || label) === priorityLabels.priority_1)) return priorityLabels.priority_1;
  else if (labels.find(label => (label.name || label) === priorityLabels.priority_2)) return priorityLabels.priority_2;
  else if (labels.find(label => (label.name || label) === priorityLabels.priority_3)) return priorityLabels.priority_3;
  else if (labels.find(label => (label.name || label) === priorityLabels.priority_4)) return priorityLabels.priority_4;
  else return;
};

const SLAGuidelines = {
  critical: 2,
  high: 14,
  medium: 45,
  low: 90
};

const isOverdue = (
  priority: string,
  date_created: Date,
  warningThreshold: number,
  overdueLabel: string,
  almostOverdueLabel: string,
  priorityLabels: PriorityLabelType
) => {
  if (!priority.length) return;

  const now = new Date();
  const daysSinceCreation = (now.getTime() - date_created.getTime()) / 86400000;

  switch (priority) {
    case priorityLabels.priority_1:
      if (daysSinceCreation > SLAGuidelines.critical) return overdueLabel;
      break;
    case priorityLabels.priority_2:
      if (daysSinceCreation > SLAGuidelines.high) return overdueLabel;
      else if (daysSinceCreation > SLAGuidelines.high - warningThreshold) return almostOverdueLabel;
      break;
    case priorityLabels.priority_3:
      if (daysSinceCreation > SLAGuidelines.medium) return overdueLabel;
      else if (daysSinceCreation > SLAGuidelines.medium - warningThreshold) return almostOverdueLabel;
      break;
    case priorityLabels.priority_4:
      if (daysSinceCreation > SLAGuidelines.low) return overdueLabel;
      else if (daysSinceCreation > SLAGuidelines.low - warningThreshold) return almostOverdueLabel;
      break;
  }
};
