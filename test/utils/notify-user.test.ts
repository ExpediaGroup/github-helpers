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

import { Mock, beforeEach, describe, expect, it, mock } from 'bun:test';
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

const { notifyUser } = await import('../../src/utils/notify-user');
const { octokit } = await import('../../src/octokit');
const { context } = await import('@actions/github');


const login = 'octocat';
const assigneeEmail = 'assignee@github.com';
const title = 'title';
const html_url = 'url';
(octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
  data: { title, html_url }
}));
(axios.post as Mock<any>).mockResolvedValue({ data: 'request succeeded' });

describe('notifyUser', () => {
  const pull_number = 123;
  const slack_webhook_url = 'https://hooks.slack.com/workflows/1234567890';
  beforeEach(async () => {
    (octokit.users.getByUsername as unknown as Mocktokit).mockImplementation(async () => ({
      data: {
        email: assigneeEmail
      }
    }));
    await notifyUser({ login, pull_number, slack_webhook_url });
  });

  it('should call getByUsername with correct params', () => {
    expect(octokit.users.getByUsername).toHaveBeenCalledWith({ username: login });
  });

  it('should call pulls with correct params', () => {
    expect(octokit.pulls.get).toHaveBeenCalledWith({ pull_number: 123, ...context.repo });
  });

  it('should call axios with correct params', () => {
    expect(axios.post).toHaveBeenCalledWith(slack_webhook_url, {
      assignee: assigneeEmail,
      title,
      html_url,
      repo: context.repo.repo
    });
  });
});

describe('notifyUser with a PR comment', () => {
  const pull_number = 123;
  const slack_webhook_url = 'https://hooks.slack.com/workflows/1234567890';

  beforeEach(async () => {
    (octokit.users.getByUsername as unknown as Mocktokit).mockImplementation(async () => ({
      data: {
        email: null
      }
    }));

    await notifyUser({ login, pull_number, slack_webhook_url });
  });

  it('should do nothing when email is not found', () => {
    expect(octokit.users.getByUsername).toHaveBeenCalledWith({ username: login });
    expect(axios.post).not.toHaveBeenCalled();
  });
});

describe('notifyUser should fail if slack webhook input is invalid', () => {
  const pull_number = 123;
  const slack_webhook_url = 'https://hooks.slack.com/workflows/1234567890';

  beforeEach(async () => {
    (octokit.users.getByUsername as unknown as Mocktokit).mockImplementation(async () => ({
      data: {
        email: null
      }
    }));

    await notifyUser({ login: '', pull_number, slack_webhook_url });
  });

  it('should fail the job', () => {
    expect(setFailed).toHaveBeenCalled();
  });
});
