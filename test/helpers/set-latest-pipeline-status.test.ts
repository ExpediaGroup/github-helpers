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

import { DEFAULT_PIPELINE_STATUS, GITHUB_OPTIONS, PRODUCTION_ENVIRONMENT } from '../../src/constants';
import { Mocktokit } from '../types';
import { context } from '@actions/github';
import { octokit } from '../../src/octokit';
import { setLatestPipelineStatus } from '../../src/helpers/set-latest-pipeline-status';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({
    rest: {
      repos: {
        createCommitStatus: jest.fn(),
        listDeployments: jest.fn(),
        listDeploymentStatuses: jest.fn()
      }
    }
  }))
}));

const deployment_id = 123;

(octokit.repos.listDeploymentStatuses as unknown as Mocktokit).mockImplementation(async () => ({
  data: [
    {
      state: 'success',
      description: 'description',
      target_url: 'url'
    },
    {
      state: 'pending',
      description: 'other description'
    }
  ]
}));

describe('setLatestDeploymentStatus', () => {
  const sha = 'sha';

  beforeEach(() => {
    (octokit.repos.listDeployments as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          id: deployment_id
        },
        {
          id: 456
        }
      ]
    }));
    setLatestPipelineStatus({ sha });
  });

  it('should call listDeployments with correct params', () => {
    expect(octokit.repos.listDeployments).toHaveBeenCalledWith({
      environment: PRODUCTION_ENVIRONMENT,
      ...context.repo,
      ...GITHUB_OPTIONS
    });
  });

  it('should call listDeploymentStatuses with correct params', () => {
    expect(octokit.repos.listDeploymentStatuses).toHaveBeenCalledWith({
      deployment_id,
      ...context.repo,
      ...GITHUB_OPTIONS
    });
  });

  it('should call createCommitStatus with correct params', () => {
    expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
      sha,
      context: DEFAULT_PIPELINE_STATUS,
      state: 'success',
      description: 'description',
      target_url: 'url',
      ...context.repo
    });
  });
});
