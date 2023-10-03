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
import { paginateAllOpenIssues } from '../utils/paginate-open-issues';
import { addOverdueLabel } from '../utils/add-overdue-labels';
import { addDueDateComment } from '../utils/add-due-date-comment';
import { IssueList, IssueLabels } from '../types/github';
import { map } from 'bluebird';

export class ManageIssueDueDates extends HelperInputs {
  /* The threshold (in days) of when to apply the "due soon" label
   * @default 7
   */
  warningThreshold?: string;
  almostOverdueLabel?: string;
  overdueLabel?: string;
  customPriorityLabels?: string;
}

export const manageIssueDueDates = async ({
  warningThreshold = '7',
  almostOverdueLabel = ALMOST_OVERDUE_ISSUE,
  overdueLabel = OVERDUE_ISSUE,
  customPriorityLabels = [PRIORITY_1, PRIORITY_2, PRIORITY_3, PRIORITY_4].join()
}: ManageIssueDueDates) => {
  const priorityLabels = customPriorityLabels.split(',');
  const openIssues: IssueList = await paginateAllOpenIssues(customPriorityLabels);

  const getPriorityLabel = (labels: IssueLabels) => {
    if (!labels) {
      return;
    }
    for (const priorityLabel of priorityLabels) {
      // Label can either be a string or an object with a 'name' property
      if (labels.find(label => (typeof label !== 'string' ? label.name : label) === priorityLabel) !== undefined) return priorityLabel;
    }

    // no priority label was found
    return;
  };

  await map(openIssues, async issue => {
    const { labels, created_at, assignee, number: issue_number, comments } = issue;
    const priority = getPriorityLabel(labels);
    if (!priority) {
      return;
    }
    const createdDate = new Date(created_at);
    const assigneeName: string = typeof assignee === 'string' ? assignee : assignee?.name ?? '';

    const daysOpenBasedOnPriority = {
      [priorityLabels[0]]: 2,
      [priorityLabels[1]]: 14,
      [priorityLabels[2]]: 45,
      [priorityLabels[3]]: 90
    };

    addOverdueLabel(
      priority,
      createdDate,
      issue_number,
      assigneeName,
      Number(warningThreshold),
      almostOverdueLabel,
      overdueLabel,
      priorityLabels
    );

    await addDueDateComment(daysOpenBasedOnPriority[priority], createdDate, issue_number, comments);
  });
};
