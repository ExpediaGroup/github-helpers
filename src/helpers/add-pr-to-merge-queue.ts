import * as core from '@actions/core';
import { READY_FOR_MERGE_PR_LABEL } from '../constants';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { removeLabel } from './remove-label';
import { setCommitStatus } from './set-commit-status';

interface AddPrToMergeQueue {
  sha: string;
}

export const addPrToMergeQueue = async ({ sha }: AddPrToMergeQueue) => {
  const { repo, owner } = context.repo;
  const issue_number = context.issue.number;
  const { data } = await octokit.issues.listLabelsOnIssue({
    issue_number,
    ...context.repo
  });
  if (!data.find(label => label.name === READY_FOR_MERGE_PR_LABEL)) {
    core.info('PR is not ready for merge.');
    const queueLabel = data.find(label => label.name.startsWith('QUEUED FOR MERGE'))?.name;
    if (queueLabel) {
      await removeLabel({ label: queueLabel, pull_number: String(issue_number) });
    }
    return;
  }
  const q = encodeURIComponent(`org:${owner} repo:${repo} type:pr state:open label:"QUEUED FOR MERGE"`);
  const {
    data: { total_count }
  } = await octokit.search.issuesAndPullRequests({ q });
  if (total_count === 0) {
    await setCommitStatus({
      sha,
      context: 'QUEUE CHECKER',
      state: 'success'
    });
  }
  return octokit.issues.addLabels({
    labels: [`QUEUED FOR MERGE #${total_count + 1}`],
    issue_number,
    ...context.repo
  });
};
