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
import { PullRequest, PullRequestList } from '../types';
import { context } from '@actions/github';
import { map } from 'bluebird';
import { notifyUser } from '../utils/notify-user';
import { octokit } from '../octokit';
import { removeLabelIfExists } from './remove-label';
import { setCommitStatus } from './set-commit-status';
import { updateMergeQueue } from '../utils/update-merge-queue';

export class ManageMergeQueue {
  login?: string;
  slack_webhook_url?: string;
}

export const manageMergeQueue = async ({ login, slack_webhook_url }: ManageMergeQueue = {}) => {
  const { data: pullRequest } = await octokit.pulls.get({ pull_number: context.issue.number, ...context.repo });
  if (pullRequest.merged || !pullRequest.labels.find(label => label.name === READY_FOR_MERGE_PR_LABEL)) {
    core.info('This PR is not in the merge queue.');
    return removePrFromQueue(pullRequest);
  }
  const queuedPrs = await getQueuedPullRequests();
  const queuePosition = queuedPrs.length;
  if (pullRequest.labels.find(label => label.name === JUMP_THE_QUEUE_PR_LABEL)) {
    return updateMergeQueue(queuedPrs);
  }
  if (!pullRequest.labels.find(label => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))) {
    await addPrToQueue(pullRequest, queuePosition);
  }

  if (slack_webhook_url && login && queuePosition === 1) {
    await notifyUser({
      login,
      pull_number: context.issue.number,
      slack_webhook_url
    });
  }

  const isFirstQueuePosition = queuePosition === 1 || pullRequest.labels.find(label => label.name === FIRST_QUEUED_PR_LABEL);
  return setCommitStatus({
    sha: pullRequest.head.sha,
    context: MERGE_QUEUE_STATUS,
    state: isFirstQueuePosition ? 'success' : 'pending',
    description: isFirstQueuePosition ? 'This PR is next to merge.' : 'This PR is in line to merge.'
  });
};

const removePrFromQueue = async (pullRequest: PullRequest) => {
  const queueLabel = pullRequest.labels.find(label => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
  if (queueLabel) {
    await map([READY_FOR_MERGE_PR_LABEL, queueLabel], async label => removeLabelIfExists(label, pullRequest.number));
    const queuedPrs = await getQueuedPullRequests();
    await updateMergeQueue(queuedPrs);
  }
};

const addPrToQueue = async (pullRequest: PullRequest, queuePosition: number) =>
  octokit.issues.addLabels({
    labels: [`${QUEUED_FOR_MERGE_PREFIX} #${queuePosition}`],
    issue_number: context.issue.number,
    ...context.repo
  });

const getQueuedPullRequests = async (): Promise<PullRequestList> => {
  const openPullRequests = await paginateAllOpenPullRequests();
  return openPullRequests.filter(pr => pr.labels.some(label => label.name === READY_FOR_MERGE_PR_LABEL));
};

const paginateAllOpenPullRequests = async (page = 1): Promise<PullRequestList> => {
  const response = await octokit.pulls.list({
    state: 'open',
    sort: 'updated',
    direction: 'desc',
    per_page: 100,
    page,
    ...context.repo
  });
  if (!response.data.length) {
    return [];
  }
  return response.data.concat(await paginateAllOpenPullRequests(page + 1));
};
