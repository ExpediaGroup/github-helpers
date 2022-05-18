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
import { deleteDeployment } from '../../src/helpers/delete-deployment';
import { octokit } from '../../src/octokit';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({
    rest: {
      repos: {
        createDeploymentStatus: jest.fn(),
        deleteDeployment: jest.fn(),
        deleteAnEnvironment: jest.fn(),
        listDeployments: jest.fn()
      }
    }
  }))
}));

describe('deleteDeployment', () => {
  const sha = 'sha';
  const environment = 'environment';
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
      deleteDeployment({
        sha,
        environment
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
        state: 'inactive',
        deployment_id,
        ...context.repo,
        ...GITHUB_OPTIONS
      });
    });

    it('should call deleteDeployment with correct params', () => {
      expect(octokit.repos.deleteDeployment).toHaveBeenCalledWith({
        deployment_id,
        ...context.repo,
        ...GITHUB_OPTIONS
      });
    });

    it('should call deleteAnEnvironment with correct params', () => {
      expect(octokit.repos.deleteAnEnvironment).toHaveBeenCalledWith({
        environment_name: environment,
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
      deleteDeployment({
        sha,
        environment
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

    it('should not call createDeploymentStatus', () => {
      expect(octokit.repos.createDeploymentStatus).not.toHaveBeenCalled();
    });

    it('should not call deleteDeployment', () => {
      expect(octokit.repos.deleteDeployment).not.toHaveBeenCalled();
    });

    it('should not call deleteAnEnvironment', () => {
      expect(octokit.repos.deleteAnEnvironment).not.toHaveBeenCalled();
    });
  });
});
