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

import { describe, expect, it, mock } from 'bun:test';
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

const { DEFAULT_PIPELINE_STATUS } = await import('../../src/constants');
const { initiateDeployment } = await import('../../src/helpers/initiate-deployment');
const { octokit } = await import('../../src/octokit');
const { context } = await import('@actions/github');

      }
    }
  }))

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

  it('should handle non merge queue case', async () => {
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
      ...context.repo
    });
    expect(octokit.repos.createDeploymentStatus).toHaveBeenCalledWith({
      state: 'in_progress',
      deployment_id,
      description,
      target_url,
      ...context.repo
    });
    expect(octokit.repos.listBranches).not.toHaveBeenCalled();
  });

  it('should handle merge queue case', async () => {
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
      target_url,
      merge_queue_enabled: 'true'
    });

    expect(octokit.repos.createDeployment).toHaveBeenCalledWith({
      ref: sha,
      environment,
      auto_merge,
      required_contexts: [],
      ...context.repo
    });
    expect(octokit.repos.createDeploymentStatus).toHaveBeenCalledWith({
      state: 'in_progress',
      deployment_id,
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
});
