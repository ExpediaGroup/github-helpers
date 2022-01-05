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
import { PullRequest, PullRequestListResponse, SimplePullRequest } from '../types';
import { context } from '@actions/github';
import { octokit } from '../octokit';

export const prepareQueuedPrForMerge = () =>
  octokit.pulls
    .list({
      state: 'open',
      per_page: 100,
      ...context.repo
    })
    .then(findNextPrToMerge)
    .then(pullRequest => {
      if (pullRequest) {
        return updatePrWithMainline(pullRequest);
      }
    });

const findNextPrToMerge = (pullRequestsResponse: PullRequestListResponse) =>
  pullRequestsResponse.data.find(pr => hasRequiredLabels(pr, [READY_FOR_MERGE_PR_LABEL, JUMP_THE_QUEUE_PR_LABEL])) ??
  pullRequestsResponse.data.find(pr => hasRequiredLabels(pr, [READY_FOR_MERGE_PR_LABEL, FIRST_QUEUED_PR_LABEL]));

const hasRequiredLabels = (pr: SimplePullRequest, requiredLabels: string[]) =>
  requiredLabels.every(mergeQueueLabel => pr.labels.some(label => label.name === mergeQueueLabel));

export const updatePrWithMainline = (pullRequest: PullRequest | SimplePullRequest) =>
  octokit.repos
    .merge({
      base: pullRequest.head.ref,
      head: 'HEAD',
      ...context.repo
    })
    .catch(error => {
      if (error.status === 204) {
        core.info('The first PR in the queue is already up to date!');
      }
      if (error.status === 409) {
        core.info('The first PR in the queue has a merge conflict.');
      }
    });
