import { octokit } from '../octokit';
import { context } from '@actions/github';
import { SECONDS_IN_A_DAY } from '../constants';

export const addOverdueLabel = (
  priority: string,
  createdDate: Date,
  issue_number: number,
  assignee: string | null | undefined,
  warningThreshold: number,
  almostOverdueLabel: string,
  overdueLabel: string,
  priorityLabels: string[]
) => {
  const SLAGuidelines = {
    [priorityLabels[0]]: 2,
    [priorityLabels[1]]: 14,
    [priorityLabels[2]]: 45,
    [priorityLabels[3]]: 90
  };

  const daysSinceCreation = Math.ceil((Date.now() - createdDate.getTime()) / SECONDS_IN_A_DAY);

  const labelToAdd =
    daysSinceCreation > SLAGuidelines[priority]
      ? overdueLabel
      : daysSinceCreation > SLAGuidelines[priority] - warningThreshold
      ? almostOverdueLabel
      : '';

  if (!labelToAdd.length) {
    return;
  }
  assignee &&
    octokit.issues.createComment({
      issue_number,
      body: `@${assignee}, this issue assigned to you is now ${labelToAdd.toLowerCase()}`,
      ...context.repo
    });

  octokit.issues.addLabels({
    labels: [labelToAdd],
    issue_number,
    ...context.repo
  });
};
