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
import { PullRequest } from '../types';
import { context } from '@actions/github';
import { map } from 'bluebird';
import { octokit } from '../octokit';
import { removeLabelIfExists } from './remove-label';
import { setCommitStatus } from './set-commit-status';
import { updateMergeQueue } from '../utils/update-merge-queue';

export const manageMergeQueue = async () => {
  const { data: pullRequest } = await octokit.pulls.get({ pull_number: context.issue.number, ...context.repo });
  if (pullRequest.merged || !pullRequest.labels.find(label => label.name === READY_FOR_MERGE_PR_LABEL)) {
    core.info('This PR is not in the merge queue.');
    return removePrFromQueue(pullRequest);
  }
  const {
    data: { items, total_count: queuePosition }
  } = await getQueuedPrData();
  if (pullRequest.labels.find(label => label.name === JUMP_THE_QUEUE_PR_LABEL)) {
    return updateMergeQueue(items);
  }
  if (!pullRequest.labels.find(label => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))) {
    await addPrToQueue(pullRequest, queuePosition);
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
    await map([READY_FOR_MERGE_PR_LABEL, queueLabel], label => removeLabelIfExists(label, pullRequest.number));
    const {
      data: { items }
    } = await getQueuedPrData();
    await updateMergeQueue(items);
  }
};

const addPrToQueue = async (pullRequest: PullRequest, queuePosition: number) =>
  octokit.issues.addLabels({
    labels: [`${QUEUED_FOR_MERGE_PREFIX} #${queuePosition}`],
    issue_number: context.issue.number,
    ...context.repo
  });

const getQueuedPrData = () => {
  const { repo, owner } = context.repo;
  return octokit.search.issuesAndPullRequests({
    q: `org:${owner}+repo:${repo}+is:pr+is:open+label:"${READY_FOR_MERGE_PR_LABEL}"`
  });
};
