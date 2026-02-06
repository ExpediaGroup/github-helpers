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

import { mock } from 'bun:test';

// Set environment variable for @actions/core
process.env.INPUT_GITHUB_TOKEN = 'mock-token';

/**
 * Creates a comprehensive Octokit mock with all commonly used endpoints.
 * Individual test files can override specific methods by reassigning them.
 */
export const createMockOctokit = () => {
  return {
    paginate: mock(() => Promise.resolve([])),
    rest: {
      actions: {
        listWorkflowRunsForRepo: mock(() => ({ data: [] })),
        reRunWorkflow: mock(() => ({ data: {} }))
      },
      checks: {
        listForRef: mock(() => ({ data: { check_runs: [] } })),
        update: mock(() => ({ data: {} }))
      },
      git: {
        deleteRef: mock(() => ({ data: {} })),
        getCommit: mock(() => ({ data: {} })),
        getRef: mock(() => ({ data: {} }))
      },
      issues: {
        addAssignees: mock(() => ({ data: {} })),
        addLabels: mock(() => ({ data: {} })),
        createComment: mock(() => ({ data: {} })),
        get: mock(() => ({ data: {} })),
        listComments: mock(() => ({ data: [] })),
        listForRepo: mock(() => ({ data: [] })),
        removeLabel: mock(() => ({ data: {} })),
        update: mock(() => ({ data: {} })),
        updateComment: mock(() => ({ data: {} }))
      },
      pulls: {
        create: mock(() => ({ data: {} })),
        createReview: mock(() => ({ data: {} })),
        get: mock(() => ({ data: {} })),
        list: mock(() => ({ data: [] })),
        listFiles: mock(() => ({ data: [] })),
        listReviews: mock(() => ({ data: [] })),
        merge: mock(() => ({ data: {} })),
        update: mock(() => ({ data: {} }))
      },
      repos: {
        compareCommitsWithBasehead: mock(() => ({ data: {} })),
        createCommitStatus: mock(() => ({ data: {} })),
        createDeployment: mock(() => ({ data: {} })),
        createDeploymentStatus: mock(() => ({ data: {} })),
        deleteAnEnvironment: mock(() => ({ data: {} })),
        deleteDeployment: mock(() => ({ data: {} })),
        get: mock(() => ({ data: {} })),
        getBranch: mock(() => ({ data: {} })),
        getCombinedStatusForRef: mock(() => ({ data: { state: 'success', statuses: [] } })),
        listBranches: mock(() => ({ data: [] })),
        listBranchesForHeadCommit: mock(() => ({ data: [] })),
        listCommitStatusesForRef: mock(() => ({ data: [] })),
        listDeploymentStatuses: mock(() => ({ data: [] })),
        listDeployments: mock(() => ({ data: [] })),
        listPullRequestsAssociatedWithCommit: mock(() => ({ data: [] })),
        merge: mock(() => ({ data: {} })),
        mergeUpstream: mock(() => ({ data: {} }))
      },
      teams: {
        listMembersInOrg: mock(() => ({ data: [] }))
      },
      users: {
        getByUsername: mock(() => ({ data: {} }))
      }
    },
    graphql: mock(() => ({}))
  };
};

/**
 * Standard @actions/core mock
 */
export const createMockActionsCore = () => ({
  getInput: mock(() => 'mock-token'),
  setOutput: mock(() => {}),
  setFailed: mock(() => {}),
  info: mock(() => {}),
  warning: mock(() => {}),
  error: mock(() => {}),
  debug: mock(() => {})
});

/**
 * Standard @actions/github mock with customizable context
 * Provides a complete context shape to avoid module pollution issues
 */
export const createMockActionsGithub = (mockOctokit: ReturnType<typeof createMockOctokit>, contextOverrides = {}) => ({
  context: {
    repo: { repo: 'repo', owner: 'owner' },
    issue: { number: 123 },
    ref: 'refs/heads/main',
    actor: 'admin',
    payload: {},
    sha: 'test-sha',
    runId: 123,
    ...contextOverrides
  },
  getOctokit: mock(() => mockOctokit)
});

/**
 * Sets up standard mocks for a test file.
 * Call this at the top of your test file before any imports.
 *
 * @param contextOverrides - Optional overrides for github context
 * @returns The mockOctokit object for further customization
 *
 * @example
 * ```ts
 * import { setupMocks } from '../setup';
 * setupMocks();
 *
 * // Override specific mocks as needed
 * mockOctokit.rest.pulls.get = mock(async () => ({ data: { ... } }));
 * ```
 */
export const setupMocks = (contextOverrides = {}) => {
  const mockOctokit = createMockOctokit();

  mock.module('@actions/core', () => createMockActionsCore());

  mock.module('@actions/github', () => createMockActionsGithub(mockOctokit, contextOverrides));

  mock.module('../../src/octokit', () => ({
    octokit: mockOctokit.rest,
    octokitGraphql: mockOctokit.graphql
  }));

  return mockOctokit;
};
