import { PullRequestSearchResults } from '../types';
import { QUEUED_FOR_MERGE_PREFIX } from '../constants';
import { context } from '@actions/github';
import { map } from 'bluebird';
import { octokit } from '../octokit';

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
  return map(prsSortedByQueuePosition, (pr, index) => {
    const { pull_number, label, queuePosition } = pr;
    const newQueuePosition = index + 1;
    if (!label || queuePosition === newQueuePosition) {
      return;
    }
    return Promise.all([
      octokit.issues.addLabels({
        labels: [`${QUEUED_FOR_MERGE_PREFIX} #${newQueuePosition}`],
        issue_number: pull_number,
        ...context.repo
      }),
      octokit.issues.removeLabel({
        name: label,
        issue_number: pull_number,
        ...context.repo
      })
    ]);
  });
};
