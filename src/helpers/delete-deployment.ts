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
import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { map } from 'bluebird';

class DeleteDeploymentResponse {
  deploymentsDeleted = 0;
  deploymentsFound = 0;
  message = '';
  environmentDeleted = false;

  constructor(init?: Partial<DeleteDeploymentResponse>) {
    Object.assign(this, init);
  }
}

export class DeleteDeployment extends HelperInputs {
  environment = '';
}

const setDeploymentStatus = async (deployment_id: number) => {
  return octokit.repos.createDeploymentStatus({
    state: 'inactive',
    deployment_id,
    ...context.repo,
    ...GITHUB_OPTIONS
  });
};

export const deleteDeployment = async ({ sha, environment }: DeleteDeployment): Promise<DeleteDeploymentResponse> => {
  const { data } = await octokit.repos.listDeployments({
    sha,
    environment,
    ...context.repo,
    ...GITHUB_OPTIONS
  });

  if (!data.length) {
    return new DeleteDeploymentResponse({
      message: `No deployments found for environment ${environment}`
    });
  }

  const deployments = data.map(deployment => deployment.id);

  const deactivateRequests = deployments.map(setDeploymentStatus);
  await Promise.all(deactivateRequests);

  const reqResults = await map(
    deployments,
    async (deploymentId: number) => {
      try {
        const reqResult = await octokit.repos.deleteDeployment({
          deployment_id: deploymentId,
          ...context.repo,
          ...GITHUB_OPTIONS
        });
        return {
          status: 'fulfilled',
          value: reqResult
        };
      } catch (error) {
        return {
          status: 'rejected',
          reason: error
        };
      }
    },
    { concurrency: 5 }
  );

  const envDelResult = await octokit.repos
    .deleteAnEnvironment({
      environment_name: environment,
      ...context.repo,
      ...GITHUB_OPTIONS
    })
    .catch(() => null);

  const deploymentsDeleted = reqResults.filter(result => result.status === 'fulfilled').length;
  const environmentDeleted = envDelResult?.status === 204;

  return new DeleteDeploymentResponse({
    deploymentsDeleted,
    deploymentsFound: data.length,
    environmentDeleted,
    message: `Deleted ${deploymentsDeleted} deployments for environment ${environment}`
  });
};
