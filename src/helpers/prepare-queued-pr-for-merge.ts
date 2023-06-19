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
import { FIRST_QUEUED_PR_LABEL, JUMP_THE_QUEUE_PR_LABEL, READY_FOR_MERGE_PR_LABEL } from '../constants';
import { GithubError, PullRequest, PullRequestList, SinglePullRequest } from '../types/github';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { removePrFromQueue } from './manage-merge-queue';

export const prepareQueuedPrForMerge = async () => {
  const { data } = await octokit.pulls.list({
    state: 'open',
    per_page: 100,
    ...context.repo
  });
  const pullRequest = findNextPrToMerge(data);
  if (pullRequest) {
    return updatePrWithMainline(pullRequest as PullRequest);
  }
};

const findNextPrToMerge = (pullRequests: PullRequestList) =>
  pullRequests.find(pr => hasRequiredLabels(pr, [READY_FOR_MERGE_PR_LABEL, JUMP_THE_QUEUE_PR_LABEL])) ??
  pullRequests.find(pr => hasRequiredLabels(pr, [READY_FOR_MERGE_PR_LABEL, FIRST_QUEUED_PR_LABEL]));

const hasRequiredLabels = (pr: SinglePullRequest, requiredLabels: string[]) =>
  requiredLabels.every(mergeQueueLabel => pr.labels.some(label => label.name === mergeQueueLabel));

export const updatePrWithMainline = async (pullRequest: PullRequest) => {
  if (pullRequest.head.user?.login && pullRequest.base.user?.login && pullRequest.head.user?.login !== pullRequest.base.user?.login) {
    try {
      // update fork default branch with upstream
      await octokit.repos.mergeUpstream({
        ...context.repo,
        branch: pullRequest.base.repo.default_branch
      });
    } catch (error) {
      if ((error as GithubError).status === 409) {
        core.setFailed('Attempt to update fork branch with upstream failed; conflict on default branch between fork and upstream.');
      } else core.setFailed((error as GithubError).message);
    }
  }
  try {
    await octokit.repos.merge({
      base: pullRequest.head.ref,
      head: 'HEAD',
      ...context.repo
    });
  } catch (error) {
    const noEvictUponConflict = core.getBooleanInput('no_evict_upon_conflict');
    if ((error as GithubError).status === 409) {
      if (!noEvictUponConflict) await removePrFromQueue(pullRequest);
      core.setFailed('The first PR in the queue has a merge conflict.');
    } else core.setFailed((error as GithubError).message);
  }
};
