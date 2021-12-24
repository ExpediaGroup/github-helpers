import * as core from '@actions/core';
import { FIRST_QUEUED_PR_LABEL, QUEUED_FOR_MERGE_PREFIX, READY_FOR_MERGE_PR_LABEL } from '../constants';
import { context } from '@actions/github';
import { getQueuedPrData } from '../utils/get-queued-pr-data';
import { octokit } from '../octokit';
import { removeLabel } from './remove-label';
import { setCommitStatus } from './set-commit-status';

interface AddPrToMergeQueue {
  sha: string;
}

export const addPrToMergeQueue = async ({ sha }: AddPrToMergeQueue) => {
  const issue_number = context.issue.number;
  const { data } = await octokit.issues.listLabelsOnIssue({
    issue_number,
    ...context.repo
  });
  if (!data.find(label => label.name === READY_FOR_MERGE_PR_LABEL)) {
    core.info('PR is not ready for merge.');
    const queueLabel = data.find(label => label.name.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
    if (queueLabel) {
      await removeLabel({ label: queueLabel, pull_number: String(issue_number) });
    }
    return;
  }
  const {
    data: { total_count }
  } = await getQueuedPrData();
  const numberInQueue = total_count + 1;
  if (numberInQueue === 1 || data.find(label => label.name === FIRST_QUEUED_PR_LABEL)) {
    await setCommitStatus({
      sha,
      context: 'QUEUE CHECKER',
      state: 'success'
    });
  }
  return octokit.issues.addLabels({
    labels: [`${QUEUED_FOR_MERGE_PREFIX} #${numberInQueue}`],
    issue_number,
    ...context.repo
  });
};
