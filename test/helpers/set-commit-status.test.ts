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
const { setCommitStatus } = await import('../../src/helpers/set-commit-status');
const { context as githubContext } = await import('@actions/github');

      }
    }
  }))

describe('setCommitStatus', () => {
  const sha = 'sha';
  const state = 'success';
  const description = 'desc';
  const target_url = 'url';

  describe('single context', () => {
    const context = 'context';

    beforeEach(async () => {
      await setCommitStatus({
        sha,
        context,
        state,
        description,
        target_url
      });
    });

    it('should call createCommitStatus with correct params', () => {
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        sha,
        context,
        state,
        description,
        target_url,
        ...githubContext.repo
      });
    });
  });

  describe('multiple contexts', () => {
    const context = 'context1\ncontext2';

    beforeEach(async () => {
      await setCommitStatus({
        sha,
        context,
        state,
        description,
        target_url
      });
    });

    it('should call createCommitStatus with correct params', () => {
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        sha,
        context: 'context1',
        state,
        description,
        target_url,
        ...githubContext.repo
      });
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        sha,
        context: 'context2',
        state,
        description,
        target_url,
        ...githubContext.repo
      });
    });
  });

  describe('ignore whitespace in context', () => {
    const context = 'context1\n\ncontext2';

    beforeEach(async () => {
      await setCommitStatus({
        sha,
        context,
        state,
        description,
        target_url
      });
    });

    it('should skip blank line', () => {
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledTimes(2);
    });
  });

  describe('skip_if_already_set set to true', () => {
    it('should skip as existing check run exited properly', async () => {
      await setCommitStatus({
        sha,
        context: 'context1',
        state,
        description,
        target_url,
        skip_if_already_set: 'true'
      });
      expect(octokit.repos.createCommitStatus).not.toHaveBeenCalled();
    });

    it('should set status as check was skipped', async () => {
      await setCommitStatus({
        sha,
        context: 'context2',
        state,
        description,
        target_url,
        skip_if_already_set: 'true'
      });
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        sha,
        context: 'context2',
        state,
        description,
        target_url,
        ...githubContext.repo
      });
    });

    it('should handle multiple inputs and only set the applicable status', async () => {
      await setCommitStatus({
        sha,
        context: 'context3\ncontext2',
        state,
        description,
        target_url,
        skip_if_already_set: 'true'
      });
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledTimes(1);
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        sha,
        context: 'context2',
        state,
        description,
        target_url,
        ...githubContext.repo
      });
    });
  });
});
