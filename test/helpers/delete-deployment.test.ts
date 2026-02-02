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

const { deleteDeployment } = await import('../../src/helpers/delete-deployment');
const { octokit } = await import('../../src/octokit');
const { context } = await import('@actions/github');


function* getDeployments(requested: number) {
  const baseId = 123;
  while (requested--) {
    yield {
      id: baseId + requested
    };
  }
}

describe('deleteDeployment', () => {
  const sha = 'sha';
  const environment = 'environment';
  const deployment_id = 123;

  describe('deployment exists', () => {
    const deployments = [...getDeployments(5)];

    beforeEach(async () => {
      (octokit.repos.listDeployments as unknown as Mocktokit).mockImplementation(async () => ({
        data: deployments
      }));

      (octokit.repos.createDeploymentStatus as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          state: 'success'
        }
      }));

      (octokit.repos.deleteDeployment as unknown as Mocktokit).mockImplementation(async () => ({
        data: {},
        status: 204
      }));

      (octokit.repos.deleteAnEnvironment as unknown as Mocktokit).mockImplementation(async () => ({
        data: {},
        status: 204
      }));

      await deleteDeployment({
        sha,
        environment
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
        state: 'inactive',
        deployment_id,
        ...context.repo
      });
    });

    it('should call deleteDeployment with correct params', () => {
      expect(octokit.repos.deleteDeployment).toHaveBeenCalledWith({
        deployment_id,
        ...context.repo
      });
    });

    it('should call deleteDeployment once per member of deployments', () => {
      expect(octokit.repos.deleteDeployment).toHaveBeenCalledTimes(deployments.length);
    });

    it('should call deleteAnEnvironment with correct params', () => {
      expect(octokit.repos.deleteAnEnvironment).toHaveBeenCalledWith({
        environment_name: environment,
        ...context.repo
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
        ...context.repo
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

  describe('some deployments were no deactivated', () => {
    const deployments = [...getDeployments(5)];

    beforeEach(async () => {
      let callCount = 0;

      (octokit.repos.listDeployments as unknown as Mocktokit).mockImplementation(async () => ({
        data: deployments
      }));

      (octokit.repos.createDeploymentStatus as unknown as Mocktokit).mockImplementation(async () => {
        const isEven = callCount % 2 === 0;
        callCount++;
        return {
          data: {
            state: isEven ? 'success' : 'failure'
          }
        };
      });

      (octokit.repos.deleteDeployment as unknown as Mocktokit).mockImplementation(async () => ({
        data: {},
        status: 204
      }));

      (octokit.repos.deleteAnEnvironment as unknown as Mocktokit).mockImplementation(async () => ({
        data: {},
        status: 204
      }));

      await deleteDeployment({
        sha,
        environment
      });
    });

    it('should print a warning message', async () => {
      expect(info).toHaveBeenCalledWith(`Not all deployments were successfully deactivated. Some may still be active.`);
    });
  });
});
