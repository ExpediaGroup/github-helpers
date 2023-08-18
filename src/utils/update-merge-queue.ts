/*
Copyright 2021 Expedia, Inc.
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

import { JUMP_THE_QUEUE_PR_LABEL, MERGE_QUEUE_STATUS, QUEUED_FOR_MERGE_PREFIX } from '../constants';
import { PullRequest, PullRequestList } from '../types/github';
import { context } from '@actions/github';
import { map } from 'bluebird';
import { octokit } from '../octokit';
import { removeLabelIfExists } from '../helpers/remove-label';
import { updatePrWithDefaultBranch } from '../helpers/prepare-queued-pr-for-merge';
import { setCommitStatus } from '../helpers/set-commit-status';

export const updateMergeQueue = (queuedPrs: PullRequestList) => {
  const sortedPrs = sortPrsByQueuePosition(queuedPrs);
  return map(sortedPrs, updateQueuePosition);
};

const sortPrsByQueuePosition = (queuedPrs: PullRequestList) =>
  queuedPrs
    .map(pr => {
      const label = pr.labels.find(label => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
      const isJumpingTheQueue = Boolean(pr.labels.find(label => label.name === JUMP_THE_QUEUE_PR_LABEL));
      const queuePosition = isJumpingTheQueue ? 0 : Number(label?.split('#')?.[1]);
      return {
        number: pr.number,
        label,
        queuePosition,
        sha: pr.head.sha
      };
    })
    .sort((pr1, pr2) => pr1.queuePosition - pr2.queuePosition);

const updateQueuePosition = async (pr: ReturnType<typeof sortPrsByQueuePosition>[number], index: number) => {
  const { number, label, queuePosition, sha } = pr;
  const newQueuePosition = index + 1;
  if (!label || isNaN(queuePosition) || queuePosition === newQueuePosition) {
    return;
  }
  if (newQueuePosition === 1) {
    const { data: firstPrInQueue } = await octokit.pulls.get({ pull_number: number, ...context.repo });
    await setCommitStatus({
      sha: firstPrInQueue.head.sha,
      context: MERGE_QUEUE_STATUS,
      state: 'success',
      description: 'This PR is next to merge.'
    });
    await Promise.all([removeLabelIfExists(JUMP_THE_QUEUE_PR_LABEL, number), updatePrWithDefaultBranch(firstPrInQueue as PullRequest)]);
  }

  return Promise.all([
    octokit.issues.addLabels({
      labels: [`${QUEUED_FOR_MERGE_PREFIX} #${newQueuePosition}`],
      issue_number: number,
      ...context.repo
    }),
    removeLabelIfExists(label, number),
    setCommitStatus({
      sha,
      context: MERGE_QUEUE_STATUS,
      state: 'pending',
      description: 'This PR is in line to merge.'
    })
  ]);
};
