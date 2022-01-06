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
import { octokit } from '../../src/octokit';
import { setDeploymentStatus } from '../../src/helpers/set-deployment-status';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({
    rest: {
      repos: {
        createDeploymentStatus: jest.fn(),
        listDeployments: jest.fn()
      }
    }
  }))
}));

describe('setDeploymentStatus', () => {
  const sha = 'sha';
  const environment = 'environment';
  const state = 'success';
  const description = 'desc';
  const target_url = 'target_url';
  const environment_url = 'environment_url';
  const deployment_id = 123;

  describe('deployment exists', () => {
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
      setDeploymentStatus({
        sha,
        state,
        environment,
        description,
        target_url,
        environment_url
      });
    });

    it('should call listDeployments with correct params', () => {
      expect(octokit.repos.listDeployments).toHaveBeenCalledWith({
        sha,
        environment,
        ...context.repo,
        ...GITHUB_OPTIONS
      });
    });

    it('should call createDeploymentStatus with correct params', () => {
      expect(octokit.repos.createDeploymentStatus).toHaveBeenCalledWith({
        state,
        deployment_id,
        description,
        target_url,
        environment_url,
        ...context.repo,
        ...GITHUB_OPTIONS
      });
    });
  });

  describe('deployment does not exist', () => {
    beforeEach(() => {
      (octokit.repos.listDeployments as unknown as Mocktokit).mockImplementation(async () => ({
        data: []
      }));
      setDeploymentStatus({
        sha,
        state,
        environment,
        description,
        target_url,
        environment_url
      });
    });

    it('should call listDeployments with correct params', () => {
      expect(octokit.repos.listDeployments).toHaveBeenCalledWith({
        sha,
        environment,
        ...context.repo,
        ...GITHUB_OPTIONS
      });
    });

    it('should call createDeploymentStatus with correct params', () => {
      expect(octokit.repos.createDeploymentStatus).not.toHaveBeenCalled();
    });
  });

  describe('update production deployment', () => {
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
      setDeploymentStatus({
        state,
        environment,
        description
      });
    });

    it('should call listDeployments with correct params', () => {
      expect(octokit.repos.listDeployments).toHaveBeenCalledWith({
        environment,
        ...context.repo,
        ...GITHUB_OPTIONS
      });
    });

    it('should call createDeploymentStatus with correct params', () => {
      expect(octokit.repos.createDeploymentStatus).toHaveBeenCalledWith({
        state,
        deployment_id,
        description,
        ...context.repo,
        ...GITHUB_OPTIONS
      });
    });
  });
});
