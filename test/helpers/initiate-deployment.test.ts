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

import { GITHUB_OPTIONS } from '../../src/constants';
import { Mocktokit } from '../types';
import { context } from '@actions/github';
import { initiateDeployment } from '../../src/helpers/initiate-deployment';
import { octokit } from '../../src/octokit';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({
    rest: {
      repos: {
        createDeployment: jest.fn(),
        createDeploymentStatus: jest.fn()
      }
    }
  }))
}));

const deployment_id = 123;
(octokit.repos.createDeployment as unknown as Mocktokit).mockImplementation(async () => ({
  data: {
    id: deployment_id
  }
}));

describe('initiateDeployment', () => {
  const sha = 'sha';
  const environment = 'env';
  const description = 'desc';
  const target_url = 'url';

  beforeEach(() => {
    initiateDeployment({
      sha,
      environment,
      description,
      target_url
    });
  });

  it('should call createDeployment with correct params', () => {
    expect(octokit.repos.createDeployment).toHaveBeenCalledWith({
      ref: sha,
      environment,
      required_contexts: [],
      ...context.repo,
      ...GITHUB_OPTIONS
    });
  });

  it('should call createDeploymentStatus with correct params', () => {
    expect(octokit.repos.createDeploymentStatus).toHaveBeenCalledWith({
      state: 'in_progress',
      deployment_id,
      description,
      target_url,
      ...context.repo,
      ...GITHUB_OPTIONS
    });
  });
});
