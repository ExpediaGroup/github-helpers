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

import { beforeEach, describe, expect, it, mock } from 'bun:test';
import type { Mocktokit } from '../types';

process.env.INPUT_GITHUB_TOKEN = 'mock-token';

const mockOctokit = {
  rest: {
    actions: {
      listWorkflowRunsForRepo: mock(() => ({})),
      reRunWorkflow: mock(() => ({}))
    },
    checks: {
      listForRef: mock(() => ({})),
      update: mock(() => ({}))
    },
    git: {
      deleteRef: mock(() => ({})),
      getCommit: mock(() => ({}))
    },
    issues: {
      addAssignees: mock(() => ({})),
      addLabels: mock(() => ({})),
      createComment: mock(() => ({})),
      get: mock(() => ({})),
      listComments: mock(() => ({})),
      listForRepo: mock(() => ({})),
      removeLabel: mock(() => ({})),
      update: mock(() => ({})),
      updateComment: mock(() => ({}))
    },
    pulls: {
      create: mock(() => ({})),
      createReview: mock(() => ({})),
      get: mock(() => ({})),
      list: mock(() => ({})),
      listFiles: mock(() => ({})),
      listReviews: mock(() => ({})),
      merge: mock(() => ({})),
      update: mock(() => ({}))
    },
    repos: {
      compareCommitsWithBasehead: mock(() => ({})),
      createCommitStatus: mock(() => ({})),
      createDeployment: mock(() => ({})),
      createDeploymentStatus: mock(() => ({})),
      deleteAnEnvironment: mock(() => ({})),
      deleteDeployment: mock(() => ({})),
      get: mock(() => ({})),
      getCombinedStatusForRef: mock(() => ({})),
      listBranches: mock(() => ({})),
      listBranchesForHeadCommit: mock(() => ({})),
      listCommitStatusesForRef: mock(() => ({})),
      listDeploymentStatuses: mock(() => ({})),
      listDeployments: mock(() => ({})),
      listPullRequestsAssociatedWithCommit: mock(() => ({})),
      merge: mock(() => ({})),
      mergeUpstream: mock(() => ({}))
    },
    teams: {
      listMembersInOrg: mock(() => ({}))
    },
    users: {
      getByUsername: mock(() => ({}))
    }
  },
  graphql: mock(() => ({}))
};

mock.module('@actions/core', () => ({
  getInput: () => 'mock-token',
  setOutput: () => {},
  setFailed: () => {},
  info: () => {},
  warning: () => {},
  error: () => {}
}));

mock.module('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: mock(() => mockOctokit)
}));

mock.module('../../src/octokit', () => ({
  octokit: mockOctokit.rest,
  octokitGraphql: mockOctokit.graphql
}));

const { octokit } = await import('../../src/octokit');
const { setDeploymentStatus } = await import('../../src/helpers/set-deployment-status');
const { context } = await import('@actions/github');


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
        ...context.repo
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
