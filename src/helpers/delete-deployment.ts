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

import { GITHUB_OPTIONS } from '../constants';
import { context } from '@actions/github';
import { octokit } from '../octokit';

interface DeleteDeployment {
  sha: string;
  environment: string;
  description?: string;
  target_url?: string;
}

export const deleteDeployment = async ({ sha, environment, description, target_url }: DeleteDeployment) => {
  const { data } = await octokit.repos.listDeployments({
    sha,
    environment,
    ...context.repo,
    ...GITHUB_OPTIONS
  });
  const deployment_id = data.find(Boolean)?.id;
  if (deployment_id) {
    return octokit.repos.deleteDeployment({
      deployment_id,
      description,
      target_url,
      ...context.repo,
      ...GITHUB_OPTIONS
    });
  }
};
