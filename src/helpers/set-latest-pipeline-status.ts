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
import { DEFAULT_PIPELINE_STATUS, PRODUCTION_ENVIRONMENT } from '../constants';
import { PipelineState } from '../types/github';
import { HelperInputs } from '../types/generated';
import { context as githubContext } from '@actions/github';
import { octokit } from '../octokit';

export class SetLatestPipelineStatus extends HelperInputs {
  sha = '';
  declare context?: string;
  declare environment?: string;
}

export const setLatestPipelineStatus = async ({
  sha,
  context = DEFAULT_PIPELINE_STATUS,
  environment = PRODUCTION_ENVIRONMENT
}: SetLatestPipelineStatus) => {
  const { data: deployments } = await octokit.repos.listDeployments({
    environment,
    ...githubContext.repo
  });
  const deployment_id = deployments.find(Boolean)?.id;
  if (!deployment_id) {
    core.info('No deployments found. Pipeline is clear!');
    return;
  }
  const { data: deploymentStatuses } = await octokit.repos.listDeploymentStatuses({
    deployment_id,
    ...githubContext.repo
  });
  const deploymentStatus = deploymentStatuses.find(Boolean);
  if (!deploymentStatus) {
    return octokit.repos.createCommitStatus({
      sha,
      context,
      state: 'pending',
      ...githubContext.repo
    });
  }
  const { state, description, target_url } = deploymentStatus;
  return octokit.repos.createCommitStatus({
    sha,
    context,
    state: deploymentStateToPipelineStateMap[state] ?? 'pending',
    description,
    target_url,
    ...githubContext.repo
  });
};

const deploymentStateToPipelineStateMap: { [deploymentState: string]: PipelineState } = {
  in_progress: 'pending',
  success: 'success',
  failure: 'failure',
  inactive: 'error'
};
