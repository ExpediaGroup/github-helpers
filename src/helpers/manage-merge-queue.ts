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

import * as core from '@actions/core';
import {
  FIRST_QUEUED_PR_LABEL,
  JUMP_THE_QUEUE_PR_LABEL,
  MERGE_QUEUE_STATUS,
  QUEUED_FOR_MERGE_PREFIX,
  READY_FOR_MERGE_PR_LABEL
} from '../constants';
import { HelperInputs } from '../types/generated';
import { PullRequest, PullRequestList } from '../types/github';
import { context } from '@actions/github';
import { notifyUser } from '../utils/notify-user';
import { octokit, octokitGraphql } from '../octokit';
import { removeLabelIfExists } from './remove-label';
import { setCommitStatus } from './set-commit-status';
import { updateMergeQueue } from '../utils/update-merge-queue';
import { paginateAllOpenPullRequests } from '../utils/paginate-open-pull-requests';
import { updatePrWithDefaultBranch } from './prepare-queued-pr-for-merge';
import { approvalsSatisfied } from './approvals-satisfied';
import { createPrComment } from './create-pr-comment';
import { join } from 'path';

export class ManageMergeQueue extends HelperInputs {
  max_queue_size?: string;
  login?: string;
  slack_webhook_url?: string;
  skip_auto_merge?: string;
}

export const manageMergeQueue = async ({ max_queue_size, login, slack_webhook_url, skip_auto_merge }: ManageMergeQueue = {}) => {
  const { data: pullRequest } = await octokit.pulls.get({ pull_number: context.issue.number, ...context.repo });
  if (pullRequest.merged || !pullRequest.labels.find(label => label.name === READY_FOR_MERGE_PR_LABEL)) {
    core.info('This PR is not in the merge queue.');
    return removePrFromQueue(pullRequest);
  }
  const prMeetsRequiredApprovals = await approvalsSatisfied({
    body: 'PRs must meet all required approvals before entering the merge queue.'
  });
  if (!prMeetsRequiredApprovals) {
    return removePrFromQueue(pullRequest);
  }
  const queuedPrs = await getQueuedPullRequests();
  const queuePosition = queuedPrs.length;

  if (queuePosition > Number(max_queue_size)) {
    await createPrComment({
      body: `The merge queue is full! Only ${max_queue_size} PRs are allowed in the queue at a time.\n\nIf you would like to merge your PR, please monitor the PRs in the queue and make sure the authors are around to merge them.`
    });
    return removePrFromQueue(pullRequest);
  }
  if (pullRequest.labels.find(label => label.name === JUMP_THE_QUEUE_PR_LABEL)) {
    return updateMergeQueue(queuedPrs);
  }
  if (!pullRequest.labels.find(label => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))) {
    await addPrToQueue(pullRequest, queuePosition, skip_auto_merge);
  }

  const isFirstQueuePosition = queuePosition === 1 || pullRequest.labels.find(label => label.name === FIRST_QUEUED_PR_LABEL);

  if (isFirstQueuePosition) {
    await updatePrWithDefaultBranch(pullRequest);
  }

  await setCommitStatus({
    sha: pullRequest.head.sha,
    context: MERGE_QUEUE_STATUS,
    state: isFirstQueuePosition ? 'success' : 'pending',
    description: isFirstQueuePosition ? 'This PR is next to merge.' : 'This PR is in line to merge.'
  });

  if (isFirstQueuePosition && slack_webhook_url && login) {
    await notifyUser({
      login,
      pull_number: context.issue.number,
      slack_webhook_url,
      comment_body: `@${login} Your PR is first in the queue!
      Email not found for user ${login}. Please add an email to your Github profile!\n\n1. Go to ${join(context.serverUrl, login)}\n2. Click "Edit profile"\n3. Update your email address\n4. Click "Save"`
    });
  }
};

export const removePrFromQueue = async (pullRequest: PullRequest) => {
  await removeLabelIfExists(READY_FOR_MERGE_PR_LABEL, pullRequest.number);
  const queueLabel = pullRequest.labels.find(label => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
  if (queueLabel) {
    await removeLabelIfExists(queueLabel, pullRequest.number);
  }
  await setCommitStatus({
    sha: pullRequest.head.sha,
    context: MERGE_QUEUE_STATUS,
    state: 'pending',
    description: 'This PR is not in the merge queue.'
  });
  const queuedPrs = await getQueuedPullRequests();
  return updateMergeQueue(queuedPrs);
};

const addPrToQueue = async (pullRequest: PullRequest, queuePosition: number, skip_auto_merge?: string) => {
  await octokit.issues.addLabels({
    labels: [`${QUEUED_FOR_MERGE_PREFIX} #${queuePosition}`],
    issue_number: context.issue.number,
    ...context.repo
  });
  if (skip_auto_merge == 'true') {
    core.info('Skipping auto merge per configuration.');
    return;
  }
  await enableAutoMerge(pullRequest.node_id);
};

const getQueuedPullRequests = async (): Promise<PullRequestList> => {
  const openPullRequests = await paginateAllOpenPullRequests();
  return openPullRequests.filter(pr => pr.labels.some(label => label.name === READY_FOR_MERGE_PR_LABEL));
};

export const enableAutoMerge = async (pullRequestId: string, mergeMethod = 'SQUASH') => {
  try {
    await octokitGraphql(`
    mutation {
      enablePullRequestAutoMerge(input: { pullRequestId: "${pullRequestId}", mergeMethod: ${mergeMethod} }) {
        clientMutationId
      }
    }
  `);
  } catch (error) {
    core.warning('Auto merge could not be enabled. Perhaps you need to enable auto-merge on your repo?');
    core.warning(error as Error);
  }
};
