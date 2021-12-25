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
import { addLabels } from './add-labels';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { removeLabel } from './remove-label';
import { setCommitStatus } from './set-commit-status';
import { updateMergeQueue } from '../utils/update-merge-queue';

export const manageMergeQueue = async () => {
  const {
    data: { items, total_count }
  } = await getQueuedPrData();
  const issue_number = context.issue.number;
  const { data: pullRequest } = await octokit.pulls.get({ pull_number: issue_number, ...context.repo });
  if (pullRequest.merged) {
    const queueLabel = pullRequest.labels.find(label => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
    if (queueLabel) {
      await removeLabel({ label: queueLabel, pull_number: String(issue_number) });
      await updateMergeQueue(items);
    }
    return;
  }

  if (!pullRequest.labels.find(label => label.name === READY_FOR_MERGE_PR_LABEL)) {
    core.info('PR is not ready for merge.');
    const queueLabel = pullRequest.labels.find(label => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
    if (queueLabel) {
      await removeLabel({ label: queueLabel, pull_number: String(issue_number) });
      await updateMergeQueue(items);
    }
    return;
  }

  const numberInQueue = total_count + 1;
  if (numberInQueue === 1 || pullRequest.labels.find(label => label.name === FIRST_QUEUED_PR_LABEL)) {
    await setCommitStatus({
      sha: pullRequest.head.sha,
      context: 'QUEUE CHECKER',
      state: 'success'
    });
  }
  return addLabels({
    labels: `${QUEUED_FOR_MERGE_PREFIX} #${numberInQueue}`,
    pull_number: String(issue_number)
  });
};

const getQueuedPrData = () => {
  const { repo, owner } = context.repo;
  return octokit.search.issuesAndPullRequests({
    q: encodeURIComponent(`org:${owner} repo:${repo} type:pr state:open label:"${QUEUED_FOR_MERGE_PREFIX}"`)
  });
};
