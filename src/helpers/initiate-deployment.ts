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

import { DeploymentState } from '../types/github';
import { DEFAULT_PIPELINE_STATUS } from '../constants';
import { HelperInputs } from '../types/generated';
import { context as githubContext } from '@actions/github';
import { octokit } from '../octokit';
import { getMergeQueueCommitHashes } from '../utils/merge-queue';
import { map } from 'bluebird';

export class InitiateDeployment extends HelperInputs {
  sha = '';
  environment = '';
  declare state?: DeploymentState;
  declare environment_url?: string;
  declare description?: string;
  declare target_url?: string;
  declare context?: string;
  declare merge_queue_enabled?: string;
}

export const initiateDeployment = async ({
  sha,
  state = 'in_progress',
  environment,
  environment_url,
  description,
  target_url,
  context = DEFAULT_PIPELINE_STATUS,
  merge_queue_enabled
}: InitiateDeployment) => {
  const { data } = await octokit.repos.createDeployment({
    ref: sha,
    environment,
    auto_merge: false,
    required_contexts: [],
    ...githubContext.repo
  });
  const deployment_id = 'ref' in data ? data.id : undefined;
  if (!deployment_id) return;

  await octokit.repos.createDeploymentStatus({
    state,
    deployment_id,
    description,
    environment_url,
    target_url,
    ...githubContext.repo
  });

  if (merge_queue_enabled === 'true') {
    const mergeQueueCommitHashes = await getMergeQueueCommitHashes();
    return map(mergeQueueCommitHashes, async sha =>
      octokit.repos.createCommitStatus({
        sha,
        context,
        state: 'pending',
        description,
        target_url,
        ...githubContext.repo
      })
    );
  }
};
