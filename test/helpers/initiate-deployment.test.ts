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

import { DEFAULT_PIPELINE_STATUS, GITHUB_OPTIONS } from '../../src/constants';
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
        createCommitStatus: jest.fn(),
        createDeployment: jest.fn(),
        createDeploymentStatus: jest.fn(),
        listBranches: jest.fn(() => ({ data: [] }))
      }
    }
  }))
}));

const deployment_id = 123;
(octokit.repos.createDeployment as unknown as Mocktokit).mockImplementation(async () => ({
  data: {
    id: deployment_id,
    ref: 'some-ref'
  }
}));

describe('initiateDeployment', () => {
  const sha = 'sha';
  const environment = 'env';
  const description = 'desc';
  const target_url = 'url';
  const auto_merge = false;

  it('should call createDeployment with correct params', async () => {
    await initiateDeployment({
      sha,
      environment,
      description,
      target_url
    });
    expect(octokit.repos.createDeployment).toHaveBeenCalledWith({
      ref: sha,
      environment,
      auto_merge,
      required_contexts: [],
      ...context.repo,
      ...GITHUB_OPTIONS
    });
  });

  it('should call createDeploymentStatus with correct params', async () => {
    await initiateDeployment({
      sha,
      environment,
      description,
      target_url
    });
    expect(octokit.repos.createDeploymentStatus).toHaveBeenCalledWith({
      state: 'in_progress',
      deployment_id,
      description,
      target_url,
      ...context.repo,
      ...GITHUB_OPTIONS
    });
  });

  it('should call createCommitStatus with correct params', async () => {
    await initiateDeployment({
      sha,
      environment,
      description,
      target_url
    });
    expect(octokit.repos.createCommitStatus).not.toHaveBeenCalledWith({
      sha: 'normal sha 1',
      context: DEFAULT_PIPELINE_STATUS,
      state: 'pending',
      description,
      target_url,
      ...context.repo
    });
    expect(octokit.repos.createCommitStatus).not.toHaveBeenCalledWith({
      sha: 'merge queue sha 1',
      context: DEFAULT_PIPELINE_STATUS,
      state: 'pending',
      description,
      target_url,
      ...context.repo
    });
    expect(octokit.repos.createCommitStatus).not.toHaveBeenCalledWith({
      sha: 'merge queue sha 2',
      context: DEFAULT_PIPELINE_STATUS,
      state: 'pending',
      description,
      target_url,
      ...context.repo
    });
  });

  it('should call createCommitStatus with correct params when merge queue branches are present', async () => {
    (octokit.repos.listBranches as unknown as Mocktokit).mockImplementation(async ({ page }) =>
      page > 1
        ? { data: [] }
        : {
            data: [
              {
                name: 'some-branch',
                commit: { sha: 'normal sha 1' }
              },
              {
                name: 'gh-readonly-queue/default-branch/pr-123-79a5ad2b1a46f6b5d77e02573937667979635f27',
                commit: { sha: 'merge queue sha 1' }
              },
              {
                name: 'gh-readonly-queue/default-branch/pr-456-79a5ad2b1a46f6b5d77e02573937667979635f27',
                commit: { sha: 'merge queue sha 2' }
              }
            ]
          }
    );
    await initiateDeployment({
      sha,
      environment,
      description,
      target_url
    });
    expect(octokit.repos.createCommitStatus).not.toHaveBeenCalledWith({
      sha: 'normal sha 1',
      context: DEFAULT_PIPELINE_STATUS,
      state: 'pending',
      description,
      target_url,
      ...context.repo
    });
    expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
      sha: 'merge queue sha 1',
      context: DEFAULT_PIPELINE_STATUS,
      state: 'pending',
      description,
      target_url,
      ...context.repo
    });
    expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
      sha: 'merge queue sha 2',
      context: DEFAULT_PIPELINE_STATUS,
      state: 'pending',
      description,
      target_url,
      ...context.repo
    });
  });

  it('should return deployment id as output', async () => {
    const result = await initiateDeployment({
      sha,
      environment,
      description,
      target_url
    });
    expect(result).toEqual(deployment_id);
  });
});
