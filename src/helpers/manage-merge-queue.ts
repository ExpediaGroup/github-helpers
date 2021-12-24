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
import { IssuesAndPullRequestsResponse } from '../types';
import { addLabels } from './add-labels';
import { context } from '@actions/github';
import { getQueuedPrData } from '../utils/get-queued-pr-data';
import { map } from 'bluebird';
import { octokit } from '../octokit';
import { removeLabel } from './remove-label';
import { setCommitStatus } from './set-commit-status';

interface ManageMergeQueue {
  sha: string;
}

export const manageMergeQueue = async ({ sha }: ManageMergeQueue) => {
  const {
    data: { items, total_count }
  } = await getQueuedPrData();
  const issue_number = context.issue.number;
  if (!issue_number) {
    return updateMergeQueue(items);
  }

  const { data } = await octokit.issues.listLabelsOnIssue({
    issue_number,
    ...context.repo
  });
  if (!data.find(label => label.name === READY_FOR_MERGE_PR_LABEL)) {
    core.info('PR is not ready for merge.');
    const queueLabel = data.find(label => label.name.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
    if (queueLabel) {
      await removeLabel({ label: queueLabel, pull_number: String(issue_number) });
      await updateMergeQueue(items);
    }
    return;
  }

  const numberInQueue = total_count + 1;
  if (numberInQueue === 1 || data.find(label => label.name === FIRST_QUEUED_PR_LABEL)) {
    await setCommitStatus({
      sha,
      context: 'QUEUE CHECKER',
      state: 'success'
    });
  }
  return octokit.issues.addLabels({
    labels: [`${QUEUED_FOR_MERGE_PREFIX} #${numberInQueue}`],
    issue_number,
    ...context.repo
  });
};

const updateMergeQueue = async (queuedPrs: IssuesAndPullRequestsResponse['data']['items']) => {
  return map(queuedPrs, pr => {
    const mergeLabel = pr.labels.find(label => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
    if (!mergeLabel) {
      return;
    }
    const pull_number = String(pr.number);
    const queueNumber = Number(mergeLabel.split('#')[1]);
    return Promise.all([
      addLabels({ pull_number, labels: `${QUEUED_FOR_MERGE_PREFIX} #${queueNumber - 1}` }),
      removeLabel({ pull_number, label: mergeLabel })
    ]);
  });
};
