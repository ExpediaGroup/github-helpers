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

import { describe, it, expect, beforeEach, Mock, mock } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

const { octokit } = await import('../../src/octokit');
const { setDeploymentStatus } = await import('../../src/helpers/set-deployment-status');
const { context } = await import('@actions/github');

const deployment_id = 123;
(octokit.repos.listDeployments as unknown as Mock<any>).mockImplementation(async () => ({
  data: [
    {
      id: deployment_id
    },
    {
      id: 456
    }
  ]
}));

describe('setDeploymentStatus', () => {
  const sha = 'sha';
  const environment = 'environment';
  const state = 'success';
  const description = 'desc';
  const target_url = 'target_url';
  const environment_url = 'environment_url';

  describe('deployment exists', () => {
    beforeEach(async () => {
      mock.clearAllMocks();
      await setDeploymentStatus({
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
        ...context.repo
      });
    });

    it('should call createDeploymentStatus with correct params', () => {
      expect(octokit.repos.createDeploymentStatus).toHaveBeenCalledWith({
        state,
        deployment_id,
        description,
        target_url,
        environment_url,
        ...context.repo
      });
    });
  });

  describe('deployment does not exist', () => {
    beforeEach(async () => {
      mock.clearAllMocks();
      (octokit.repos.listDeployments as unknown as Mock<any>).mockImplementation(async () => ({
        data: []
      }));
      await setDeploymentStatus({
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
        ...context.repo
      });
    });

    it('should call createDeploymentStatus with correct params', () => {
      expect(octokit.repos.createDeploymentStatus).not.toHaveBeenCalled();
    });
  });

  describe('update production deployment', () => {
    beforeEach(() => {
      (octokit.repos.listDeployments as unknown as Mock<any>).mockImplementation(async () => ({
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
        ...context.repo
      });
    });

    it('should call createDeploymentStatus with correct params', () => {
      expect(octokit.repos.createDeploymentStatus).toHaveBeenCalledWith({
        state,
        deployment_id,
        description,
        ...context.repo
      });
    });
  });
});
