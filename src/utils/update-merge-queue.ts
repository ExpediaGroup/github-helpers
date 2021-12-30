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
