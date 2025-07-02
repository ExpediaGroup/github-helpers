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
import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { map } from 'bluebird';

const DEFAULT_MAP_CONCURRENCY = 5;

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

const deactivateDeployments = async (deployments: number[]) => {
  const statusResponse = await map(
    deployments,
    async (deploymentId: number) => {
      return octokit.repos.createDeploymentStatus({
        state: 'inactive',
        deployment_id: deploymentId,
        ...context.repo
      });
    },
    { concurrency: DEFAULT_MAP_CONCURRENCY }
  );

  const deletionMatch = statusResponse.filter(result => result.data.state === 'success').length === deployments.length;
  if (!deletionMatch) {
    core.info(`Not all deployments were successfully deactivated. Some may still be active.`);
  }
};

const deleteDeployments = async (deployments: number[]) => {
  return await map(
    deployments,
    async (deploymentId: number) => {
      return octokit.repos.deleteDeployment({
        deployment_id: deploymentId,
        ...context.repo
      });
    },
    { concurrency: DEFAULT_MAP_CONCURRENCY }
  );
};

export const deleteDeployment = async ({ sha, environment }: DeleteDeployment): Promise<DeleteDeploymentResponse> => {
  const { data } = await octokit.repos.listDeployments({
    sha,
    environment,
    ...context.repo
  });

  if (!data.length) {
    return new DeleteDeploymentResponse({
      message: `No deployments found for environment ${environment}`
    });
  }

  const deployments = data.map(deployment => deployment.id);

  await deactivateDeployments(deployments);

  const reqResults = await deleteDeployments(deployments);

  const envDelResult = await octokit.repos
    .deleteAnEnvironment({
      environment_name: environment,
      ...context.repo
    })
    .catch(() => null);

  const deploymentsDeleted = reqResults.filter(result => result.status === 204).length;
  const environmentDeleted = envDelResult?.status === 204;

  return new DeleteDeploymentResponse({
    deploymentsDeleted,
    deploymentsFound: data.length,
    environmentDeleted,
    message: `Deleted ${deploymentsDeleted} deployments for environment ${environment}`
  });
};
