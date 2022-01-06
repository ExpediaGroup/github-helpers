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

import { JUMP_THE_QUEUE_PR_LABEL, QUEUED_FOR_MERGE_PREFIX } from '../constants';
import { PullRequestSearchResults } from '../types';
import { context } from '@actions/github';
import { map } from 'bluebird';
import { octokit } from '../octokit';
import { removeLabelIfExists } from '../helpers/remove-label';
import { updatePrWithMainline } from '../helpers/prepare-queued-pr-for-merge';

export const updateMergeQueue = (queuedPrs: PullRequestSearchResults) => {
  const sortedPrs = sortPrsByQueuePosition(queuedPrs);
  return map(sortedPrs, updateQueuePosition);
};

const sortPrsByQueuePosition = (queuedPrs: PullRequestSearchResults): QueuedPr[] =>
  queuedPrs
    .map(pr => {
      const label = pr.labels.find(label => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
      const isJumpingTheQueue = Boolean(pr.labels.find(label => label.name === JUMP_THE_QUEUE_PR_LABEL));
      const queuePosition = isJumpingTheQueue ? 0 : Number(label?.split('#')?.[1]);
      return {
        number: pr.number,
        label,
        queuePosition
      };
    })
    .sort((pr1, pr2) => pr1.queuePosition - pr2.queuePosition);

const updateQueuePosition = async (pr: QueuedPr, index: number) => {
  const { number, label, queuePosition } = pr;
  const newQueuePosition = index + 1;
  if (!label || isNaN(queuePosition) || queuePosition === newQueuePosition) {
    return;
  }
  if (newQueuePosition === 1) {
    const { data: pullRequest } = await octokit.pulls.get({ pull_number: number, ...context.repo });
    await Promise.all([removeLabelIfExists(JUMP_THE_QUEUE_PR_LABEL, number), updatePrWithMainline(pullRequest)]);
  }

  return Promise.all([
    octokit.issues.addLabels({
      labels: [`${QUEUED_FOR_MERGE_PREFIX} #${newQueuePosition}`],
      issue_number: number,
      ...context.repo
    }),
    removeLabelIfExists(label, number)
  ]);
};

type QueuedPr = {
  number: number;
  label?: string;
  queuePosition: number;
};
