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

import { DEFAULT_PIPELINE_DESCRIPTION, DEFAULT_PIPELINE_STATUS, PRODUCTION_ENVIRONMENT } from '../constants';
import { HelperInputs } from '../types/generated';
import { context as githubContext } from '@actions/github';
import { map } from 'bluebird';
import { octokit } from '../octokit';
import { getMergeQueueCommitHashes } from '../utils/merge-queue';

export class NotifyPipelineComplete extends HelperInputs {
  declare context?: string;
  declare description?: string;
  declare environment?: string;
  declare target_url?: string;
  declare merge_queue_enabled?: string;
}

export const notifyPipelineComplete = async ({
  context = DEFAULT_PIPELINE_STATUS,
  description = DEFAULT_PIPELINE_DESCRIPTION,
  environment = PRODUCTION_ENVIRONMENT,
  target_url,
  merge_queue_enabled
}: NotifyPipelineComplete) => {
  const { data: deployments } = await octokit.repos.listDeployments({
    environment,
    ...githubContext.repo
  });
  const deployment_id = deployments.find(Boolean)?.id;
  if (!deployment_id) return;
  await octokit.repos.createDeploymentStatus({
    environment,
    deployment_id,
    state: 'success',
    description,
    target_url,
    ...githubContext.repo
  });

  if (merge_queue_enabled === 'true') {
    const mergeQueueCommitHashes = await getMergeQueueCommitHashes();
    return map(mergeQueueCommitHashes, async sha =>
      octokit.repos.createCommitStatus({
        sha,
        context,
        state: 'success',
        description,
        target_url,
        ...githubContext.repo
      })
    );
  }

  const { data: pullRequests } = await octokit.pulls.list({
    state: 'open',
    per_page: 100,
    ...githubContext.repo
  });
  const commitHashesForOpenPullRequests = pullRequests.map(pullRequest => pullRequest.head.sha);
  return map(commitHashesForOpenPullRequests, async sha =>
    octokit.repos.createCommitStatus({
      sha,
      context,
      state: 'success',
      description,
      target_url,
      ...githubContext.repo
    })
  );
};
