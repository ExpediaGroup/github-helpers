import { MERGE_QUEUE_STATUS, QUEUED_FOR_MERGE_PREFIX } from '../constants';
import { PullRequestSearchResults } from '../types';
import { context } from '@actions/github';
import { map } from 'bluebird';
import { octokit } from '../octokit';
import { removeLabelIfExists } from '../helpers/remove-label';
import { setCommitStatus } from '../helpers/set-commit-status';

export const updateMergeQueue = (queuedPrs: PullRequestSearchResults) => {
  const prsSortedByQueuePosition = queuedPrs
    .map(pr => {
      const label = pr.labels.find(label => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
      const queuePosition = Number(label?.split('#')?.[1]);
      return {
        pull_number: pr.number,
        label,
        queuePosition
      };
    })
    .sort((pr1, pr2) => pr1.queuePosition - pr2.queuePosition);
  return map(prsSortedByQueuePosition, async (pr, index) => {
    const { pull_number, label, queuePosition } = pr;
    const newQueuePosition = index + 1;
    if (!label || queuePosition === newQueuePosition) {
      return;
    }
    if (newQueuePosition === 1) {
      const { data: pullRequest } = await octokit.pulls.get({ pull_number, ...context.repo });
      await setCommitStatus({
        sha: pullRequest.head.sha,
        context: MERGE_QUEUE_STATUS,
        state: 'success',
        description: 'This PR is next to merge.'
      });
    }

    return Promise.all([
      octokit.issues.addLabels({
        labels: [`${QUEUED_FOR_MERGE_PREFIX} #${newQueuePosition}`],
        issue_number: pull_number,
        ...context.repo
      }),
      removeLabelIfExists(label, pull_number)
    ]);
  });
};
