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
import { context as githubContext } from '@actions/github';
import { map } from 'bluebird';
import { octokit } from '../octokit';
import { setDeploymentStatus } from './set-deployment-status';

interface NotifyPipelineComplete {
  context?: string;
  description?: string;
  target_url?: string;
}

export const notifyPipelineComplete = async ({
  context = DEFAULT_PIPELINE_STATUS,
  description = DEFAULT_PIPELINE_DESCRIPTION,
  target_url
}: NotifyPipelineComplete) => {
  const { data } = await octokit.pulls.list({
    state: 'open',
    per_page: 100,
    ...githubContext.repo
  });
  const commitHashes = data.map(pullRequest => pullRequest.head.sha);
  return Promise.all([
    map(commitHashes, async sha =>
      octokit.repos.createCommitStatus({
        sha,
        context,
        state: 'success',
        description,
        target_url,
        ...githubContext.repo
      })
    ),
    setDeploymentStatus({
      description: DEFAULT_PIPELINE_DESCRIPTION,
      environment: PRODUCTION_ENVIRONMENT,
      state: 'success',
      ...githubContext.repo
    })
  ]);
};
