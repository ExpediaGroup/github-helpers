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
import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import { octokit } from '../octokit';

export class SetDeploymentStatus extends HelperInputs {
  state = '';
  environment = '';
  declare sha?: string;
  declare description?: string;
  declare target_url?: string;
  declare environment_url?: string;
}

export const setDeploymentStatus = async ({ sha, state, environment, description, target_url, environment_url }: SetDeploymentStatus) => {
  const { data } = await octokit.repos.listDeployments({
    sha,
    environment,
    ...context.repo
  });
  const deployment_id = data.find(Boolean)?.id;
  if (deployment_id) {
    return octokit.repos.createDeploymentStatus({
      state: state as DeploymentState,
      deployment_id,
      description,
      target_url,
      environment_url,
      ...context.repo
    });
  }
};
