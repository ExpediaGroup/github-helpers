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
import { DEFAULT_PIPELINE_STATUS, GITHUB_OPTIONS } from '../constants';
import { HelperInputs } from '../types/generated';
import { context as githubContext } from '@actions/github';
import { octokit } from '../octokit';
import { map } from 'bluebird';

export class InitiateDeployment extends HelperInputs {
  sha = '';
  environment = '';
  state?: DeploymentState;
  environment_url?: string;
  description?: string;
  target_url?: string;
}

export const initiateDeployment = async ({
  sha,
  state = 'in_progress',
  context = DEFAULT_PIPELINE_STATUS,
  environment,
  environment_url,
  description,
  target_url
}: InitiateDeployment) => {
  const { data } = await octokit.repos.createDeployment({
    ref: sha,
    environment,
    auto_merge: false,
    required_contexts: [],
    ...githubContext.repo,
    ...GITHUB_OPTIONS
  });
  const deployment_id = 'ref' in data ? data.id : undefined;
  if (!deployment_id) return;

  await octokit.repos.createDeploymentStatus({
    state,
    deployment_id,
    description,
    environment_url,
    target_url,
    ...githubContext.repo,
    ...GITHUB_OPTIONS
  });

  const { data: branches } = await octokit.repos.listBranches({
    ...githubContext.repo
  });
  const mergeQueueBranches = branches.filter(branch => branch.name.startsWith('gh-readonly-queue/merge-queue/'));
  const commitHashesForMergeQueueBranches = mergeQueueBranches.map(branch => branch.commit.sha);
  await map(commitHashesForMergeQueueBranches, async sha =>
    octokit.repos.createCommitStatus({
      sha,
      context,
      state: 'pending',
      description,
      target_url,
      ...githubContext.repo
    })
  );

  return deployment_id;
};
