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

import { octokit } from '../octokit';
import { context as githubContext } from '@actions/github';
import * as core from '@actions/core';
import { DEFAULT_PIPELINE_STATUS, GITHUB_OPTIONS, PRODUCTION_ENVIRONMENT } from '../constants';
import { PipelineState } from '../types';

interface SetLatestPipelineStatus {
  sha: string;
  context?: string;
  environment?: string;
}

export const setLatestPipelineStatus = ({
  sha,
  context = DEFAULT_PIPELINE_STATUS,
  environment = PRODUCTION_ENVIRONMENT
}: SetLatestPipelineStatus) =>
  octokit.repos
    .listDeployments({
      environment,
      ...githubContext.repo,
      ...GITHUB_OPTIONS
    })
    .then(deploymentsResponse => {
      const deployment_id = deploymentsResponse.data.find(Boolean)?.id;
      if (!deployment_id) {
        core.setFailed('No deployments found.');
        throw new Error();
      }
      return octokit.repos.listDeploymentStatuses({
        deployment_id,
        ...githubContext.repo,
        ...GITHUB_OPTIONS
      });
    })
    .then(deploymentStatusResponse => deploymentStatusResponse.data.find(Boolean))
    .then(deploymentStatus => {
      if (!deploymentStatus) {
        core.setFailed('No deployment statuses found.');
        throw new Error();
      }
      return octokit.repos.createCommitStatus({
        sha,
        context,
        state: deploymentStateToPipelineStateMap[deploymentStatus.state],
        description: deploymentStatus.description,
        target_url: deploymentStatus.target_url,
        ...githubContext.repo
      });
    });

const deploymentStateToPipelineStateMap: { [deploymentState: string]: PipelineState } = {
  in_progress: 'pending',
  success: 'success',
  failure: 'failure',
  inactive: 'error'
};
