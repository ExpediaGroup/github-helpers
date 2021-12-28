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
import { FIRST_QUEUED_PR_LABEL, QUEUED_FOR_MERGE_PREFIX, READY_FOR_MERGE_PR_LABEL } from '../constants';
import { PullRequest, PullRequestSearchResults } from '../types';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { setCommitStatus } from './set-commit-status';
import { updateMergeQueue } from '../utils/update-merge-queue';

export const manageMergeQueue = async () => {
  const {
    data: { items, total_count: queuePosition }
  } = await getQueuedPrData();
  const issue_number = context.issue.number;
  const { data: pullRequest } = await octokit.pulls.get({ pull_number: issue_number, ...context.repo });
  if (pullRequest.merged || !pullRequest.labels.find(label => label.name === READY_FOR_MERGE_PR_LABEL)) {
    core.info('This PR is not in the merge queue.');
    return removePRFromQueue(pullRequest, items);
  }

  const isFirstQueuePosition = queuePosition === 1 || pullRequest.labels.find(label => label.name === FIRST_QUEUED_PR_LABEL);
  return Promise.all([
    octokit.issues.addLabels({
      labels: [`${QUEUED_FOR_MERGE_PREFIX} #${queuePosition}`],
      issue_number,
      ...context.repo
    }),
    setCommitStatus({
      sha: pullRequest.head.sha,
      context: 'QUEUE CHECKER',
      state: isFirstQueuePosition ? 'success' : 'pending',
      description: isFirstQueuePosition ? 'This PR is next to merge.' : `This PR is #${queuePosition} in line to merge.`
    })
  ]);
};

const removePRFromQueue = async (pullRequest: PullRequest, queuedPrs: PullRequestSearchResults) => {
  const queueLabel = pullRequest.labels.find(label => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
  if (queueLabel) {
    await octokit.issues.removeLabel({
      name: queueLabel,
      issue_number: pullRequest.number,
      ...context.repo
    });
    await updateMergeQueue(queuedPrs);
  }
};

const getQueuedPrData = () => {
  const { repo, owner } = context.repo;
  return octokit.search.issuesAndPullRequests({
    q: `org:${owner}+repo:${repo}+is:pr+is:open+label:"${READY_FOR_MERGE_PR_LABEL}"`
  });
};
