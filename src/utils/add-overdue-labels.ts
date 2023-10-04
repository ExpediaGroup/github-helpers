import { octokit } from '../octokit';
import { context } from '@actions/github';
import { ALMOST_OVERDUE_ISSUE, OVERDUE_ISSUE, SECONDS_IN_A_DAY } from '../constants';

export const addOverdueLabel = (
  createdDate: Date,
  issue_number: number,
  assignee: string | null | undefined,
  warningThreshold: number,
  SLAGuidelines: number
) => {
  const daysSinceCreation = Math.ceil((Date.now() - createdDate.getTime()) / SECONDS_IN_A_DAY);

  const labelToAdd =
    daysSinceCreation > SLAGuidelines ? OVERDUE_ISSUE : daysSinceCreation > SLAGuidelines - warningThreshold ? ALMOST_OVERDUE_ISSUE : '';

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
