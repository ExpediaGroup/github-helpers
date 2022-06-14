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
import { FIRST_QUEUED_PR_LABEL, READY_FOR_MERGE_PR_LABEL } from '../constants';
import { HelperInputs } from '../types/inputs';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { removeLabelIfExists } from './remove-label';

export class RemovePrFromMergeQueue extends HelperInputs {
  seconds = '';
}

export const removePrFromMergeQueue = async ({ seconds }: RemovePrFromMergeQueue) => {
  const { data: prData } = await octokit.pulls.list({
    state: 'open',
    per_page: 100,
    ...context.repo
  });
  const firstQueuedPr = prData.find(pr => pr.labels.some(label => label.name === FIRST_QUEUED_PR_LABEL));
  if (!firstQueuedPr) {
    core.info('No PR is first in the merge queue.');
    return;
  }

  const {
    number,
    head: { sha }
  } = firstQueuedPr;
  const { data } = await octokit.repos.listCommitStatusesForRef({
    ref: sha,
    ...context.repo
  });
  const failingStatus = data.find(status => status.state === 'failure');
  if (failingStatus && timestampIsStale(failingStatus.created_at, seconds)) {
    return removeLabelIfExists(READY_FOR_MERGE_PR_LABEL, number);
  }
};

const timestampIsStale = (timestamp: string, seconds: string) => {
  const ageOfTimestampInMiliseconds = Date.now() - new Date(timestamp).getTime();
  const milisecondsConsideredStale = Number(seconds) * 1000;
  return ageOfTimestampInMiliseconds > milisecondsConsideredStale;
};
