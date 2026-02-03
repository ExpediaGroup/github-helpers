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

import { describe, it, expect, beforeEach, Mock } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

const { DEFAULT_PIPELINE_STATUS, PRODUCTION_ENVIRONMENT } = await import('../../src/constants');
const { octokit } = await import('../../src/octokit');
const { setLatestPipelineStatus } = await import('../../src/helpers/set-latest-pipeline-status');
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

describe('setLatestDeploymentStatus', () => {
  const sha = 'sha';
  describe('deployment status found', () => {
    beforeEach(() => {
      (octokit.repos.listDeploymentStatuses as unknown as Mock<any>).mockImplementation(async () => ({
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
      setLatestPipelineStatus({ sha });
    });

    it('should call listDeployments with correct params', () => {
      expect(octokit.repos.listDeployments).toHaveBeenCalledWith({
        environment: PRODUCTION_ENVIRONMENT,
        ...context.repo
      });
    });

    it('should call listDeploymentStatuses with correct params', () => {
      expect(octokit.repos.listDeploymentStatuses).toHaveBeenCalledWith({
        deployment_id,
        ...context.repo
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

  describe('deployment status not found', () => {
    beforeEach(() => {
      (octokit.repos.listDeploymentStatuses as unknown as Mock<any>).mockImplementation(async () => ({
        data: []
      }));
      setLatestPipelineStatus({ sha });
    });

    it('should call createCommitStatus with correct params', () => {
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        sha,
        context: DEFAULT_PIPELINE_STATUS,
        state: 'pending',
        ...context.repo
      });
    });
  });
});
