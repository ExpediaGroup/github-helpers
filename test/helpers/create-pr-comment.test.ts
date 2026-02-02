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

const { createPrComment } = await import('../../src/helpers/create-pr-comment');
const { octokit } = await import('../../src/octokit');
const { context } = await import('@actions/github');


(octokit.issues.listComments as unknown as Mocktokit).mockImplementation(async () => ({
  data: [
    {
      id: 12345,
      body: 'body',
      user: {
        login: 'login'
      }
    },
    {
      id: 456,
      body: 'some other body',
      user: {
        login: 'some other login'
      }
    }
  ]
}));
(octokit.repos.listPullRequestsAssociatedWithCommit as unknown as Mocktokit).mockImplementation(async () => ({
  data: [
    {
      number: 112233
    },
    {
      number: 456
    }
  ]
}));

describe('createPrComment', () => {
  describe('create comment in same PR', () => {
    const body = 'body';

    beforeEach(() => {
      createPrComment({ body });
    });

    it('should call createComment with correct params', () => {
      expect(octokit.issues.createComment).toHaveBeenCalledWith({
        body,
        issue_number: 123,
        ...context.repo
      });
    });
  });

  describe('create comment in other repo', () => {
    const body = 'body';

    beforeEach(() => {
      createPrComment({ body, repo_name: 'another-repo', repo_owner_name: 'another-owner', pull_number: '456' });
    });

    it('should call createComment with correct params', () => {
      expect(octokit.issues.createComment).toHaveBeenCalledWith({
        body,
        issue_number: 456,
        repo: 'another-repo',
        owner: 'another-owner'
      });
    });
  });

  describe('create comment case - sha supplied', () => {
    const body = 'body';
    const sha = 'sha';

    beforeEach(() => {
      createPrComment({ body, sha });
    });

    it('should call listPullRequestsAssociatedWithCommit with correct params', () => {
      expect(octokit.repos.listPullRequestsAssociatedWithCommit).toHaveBeenCalledWith({
        commit_sha: 'sha',
        ...context.repo
      });
    });

    it('should call createComment with correct params', () => {
      expect(octokit.issues.createComment).toHaveBeenCalledWith({
        body,
        issue_number: 112233,
        ...context.repo
      });
    });

    it('should not call updateComment', () => {
      expect(octokit.issues.updateComment).not.toHaveBeenCalled();
    });
  });

  describe('create comment case - login supplied', () => {
    const body = 'body';
    const login = 'login-with-no-matching-comments';

    beforeEach(() => {
      createPrComment({ body, login });
    });

    it('should call createComment with correct params', () => {
      expect(octokit.issues.createComment).toHaveBeenCalledWith({
        body,
        issue_number: 123,
        ...context.repo
      });
    });

    it('should call listComments with correct params', () => {
      expect(octokit.issues.listComments).toHaveBeenCalledWith({
        issue_number: 123,
        ...context.repo
      });
    });

    it('should not call updateComment', () => {
      expect(octokit.issues.updateComment).not.toHaveBeenCalled();
    });
  });

  describe('update comment case - sha and login supplied', () => {
    const body = 'body';
    const sha = 'sha';
    const login = 'login';

    beforeEach(() => {
      createPrComment({ body, sha, login });
    });

    it('should call listPullRequestsAssociatedWithCommit with correct params', () => {
      expect(octokit.repos.listPullRequestsAssociatedWithCommit).toHaveBeenCalledWith({
        commit_sha: 'sha',
        ...context.repo
      });
    });

    it('should call updateComment with correct params', () => {
      expect(octokit.issues.updateComment).toHaveBeenCalledWith({
        comment_id: 12345,
        body,
        ...context.repo
      });
    });

    it('should call listComments with correct params', () => {
      expect(octokit.issues.listComments).toHaveBeenCalledWith({
        issue_number: 123,
        ...context.repo
      });
    });

    it('should not call createComment', () => {
      expect(octokit.issues.createComment).not.toHaveBeenCalled();
    });
  });

  describe('update comment case - login supplied', () => {
    const body = 'body';
    const login = 'login';

    beforeEach(() => {
      createPrComment({ body, login });
    });

    it('should call updateComment with correct params', () => {
      expect(octokit.issues.updateComment).toHaveBeenCalledWith({
        comment_id: 12345,
        body,
        ...context.repo
      });
    });

    it('should call listComments with correct params', () => {
      expect(octokit.issues.listComments).toHaveBeenCalledWith({
        issue_number: 123,
        ...context.repo
      });
    });

    it('should not call createComment', () => {
      expect(octokit.issues.createComment).not.toHaveBeenCalled();
    });
  });
});
