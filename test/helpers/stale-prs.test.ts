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

import { context } from '@actions/github';
import { stalePrs } from '../../src/helpers/stale-prs';
import { octokit } from '../../src/octokit';
import { paginateAllOpenPullRequests } from '../../src/utils/paginate-open-pull-requests';
import { createPrComment } from '../../src/helpers/create-pr-comment';
import { closePr } from '../../src/helpers/close-pr';
import { PullRequestList } from '../../src/types/github';

jest.mock('../../src/utils/paginate-open-pull-requests');
jest.mock('../../src/helpers/create-pr-comment');
jest.mock('../../src/helpers/close-pr');
jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({
    rest: {
      issues: {
        addLabels: jest.fn()
      }
    }
  }))
}));

const mockPaginateAllOpenPullRequests = paginateAllOpenPullRequests as jest.MockedFunction<typeof paginateAllOpenPullRequests>;
const mockCreatePrComment = createPrComment as jest.MockedFunction<typeof createPrComment>;
const mockClosePr = closePr as jest.MockedFunction<typeof closePr>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockPullRequest = any;

describe('stalePrs', () => {
  const now = new Date('2023-02-24T10:00:00Z');
  const thirtyDaysAgo = new Date('2023-01-25T10:00:00Z');
  const fiveDaysAgo = new Date('2023-02-19T10:00:00Z');

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, 'now').mockImplementation(() => now.getTime());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should mark stale PRs with stale label and comment', async () => {
    const mockPrs: MockPullRequest[] = [
      {
        number: 1,
        updated_at: thirtyDaysAgo.toISOString(),
        draft: false,
        user: { login: 'user1' },
        labels: []
      },
      {
        number: 2,
        updated_at: fiveDaysAgo.toISOString(),
        draft: false,
        user: { login: 'user2' },
        labels: []
      }
    ];

    mockPaginateAllOpenPullRequests.mockResolvedValue(mockPrs as PullRequestList);

    const result = await stalePrs({ days: '30' });

    expect(octokit.issues.addLabels).toHaveBeenCalledWith({
      ...context.repo,
      issue_number: 1,
      labels: ['stale']
    });
    expect(mockCreatePrComment).toHaveBeenCalledWith({
      body: 'This pull request has been automatically marked as stale because it has not had recent activity. It will be closed if no further activity occurs.',
      pull_number: '1'
    });
    expect(result.summary.staled).toBe(1);
    expect(result.summary.skipped).toBe(1);
  });

  it('should skip PRs that already have stale label', async () => {
    const mockPrs: MockPullRequest[] = [
      {
        number: 1,
        updated_at: thirtyDaysAgo.toISOString(),
        draft: false,
        user: { login: 'user1' },
        labels: [{ name: 'stale' }]
      }
    ];

    mockPaginateAllOpenPullRequests.mockResolvedValue(mockPrs as PullRequestList);

    const result = await stalePrs({ days: '30' });

    expect(octokit.issues.addLabels).not.toHaveBeenCalled();
    expect(mockCreatePrComment).not.toHaveBeenCalled();
    expect(result.summary.staled).toBe(0);
  });

  it('should close PRs that have close label', async () => {
    const mockPrs: MockPullRequest[] = [
      {
        number: 1,
        updated_at: thirtyDaysAgo.toISOString(),
        draft: false,
        user: { login: 'user1' },
        labels: [{ name: 'close-stale' }]
      }
    ];

    mockPaginateAllOpenPullRequests.mockResolvedValue(mockPrs as PullRequestList);

    const result = await stalePrs({
      days: '30',
      close_label: 'close-stale',
      close_comment: 'Closing due to inactivity'
    });

    expect(mockClosePr).toHaveBeenCalledWith({
      body: 'Closing due to inactivity',
      pull_number: '1'
    });
    expect(result.summary.closed).toBe(1);
  });

  it('should skip PRs with exempt labels', async () => {
    const mockPrs: MockPullRequest[] = [
      {
        number: 1,
        updated_at: thirtyDaysAgo.toISOString(),
        draft: false,
        user: { login: 'user1' },
        labels: [{ name: 'wip' }]
      }
    ];

    mockPaginateAllOpenPullRequests.mockResolvedValue(mockPrs as PullRequestList);

    const result = await stalePrs({
      days: '30',
      exempt_labels: 'wip,blocked'
    });

    expect(octokit.issues.addLabels).not.toHaveBeenCalled();
    expect(result.summary.skipped).toBe(1);
    expect(result.processed_prs[0]?.reason).toBe('exempt label');
  });

  it('should skip draft PRs when exempt_draft_pr is true', async () => {
    const mockPrs: MockPullRequest[] = [
      {
        number: 1,
        updated_at: thirtyDaysAgo.toISOString(),
        draft: true,
        user: { login: 'user1' },
        labels: []
      }
    ];

    mockPaginateAllOpenPullRequests.mockResolvedValue(mockPrs as PullRequestList);

    const result = await stalePrs({
      days: '30',
      exempt_draft_pr: 'true'
    });

    expect(octokit.issues.addLabels).not.toHaveBeenCalled();
    expect(result.summary.staled).toBe(0);
  });

  it('should process draft PRs when exempt_draft_pr is false', async () => {
    const mockPrs: MockPullRequest[] = [
      {
        number: 1,
        updated_at: thirtyDaysAgo.toISOString(),
        draft: true,
        user: { login: 'user1' },
        labels: []
      }
    ];

    mockPaginateAllOpenPullRequests.mockResolvedValue(mockPrs as PullRequestList);

    const result = await stalePrs({
      days: '30',
      exempt_draft_pr: 'false'
    });

    expect(octokit.issues.addLabels).toHaveBeenCalled();
    expect(result.summary.staled).toBe(1);
  });

  it('should skip PRs from exempt authors', async () => {
    const mockPrs: MockPullRequest[] = [
      {
        number: 1,
        updated_at: thirtyDaysAgo.toISOString(),
        draft: false,
        user: { login: 'dependabot[bot]' },
        labels: []
      }
    ];

    mockPaginateAllOpenPullRequests.mockResolvedValue(mockPrs as PullRequestList);

    const result = await stalePrs({
      days: '30',
      exempt_authors: 'dependabot[bot],renovate[bot]'
    });

    expect(octokit.issues.addLabels).not.toHaveBeenCalled();
    expect(result.summary.staled).toBe(0);
  });

  it('should only process PRs with specific labels when only_labels is set', async () => {
    const mockPrs: MockPullRequest[] = [
      {
        number: 1,
        updated_at: thirtyDaysAgo.toISOString(),
        draft: false,
        user: { login: 'user1' },
        labels: [{ name: 'feature' }]
      },
      {
        number: 2,
        updated_at: thirtyDaysAgo.toISOString(),
        draft: false,
        user: { login: 'user2' },
        labels: [{ name: 'bug' }]
      }
    ];

    mockPaginateAllOpenPullRequests.mockResolvedValue(mockPrs as PullRequestList);

    const result = await stalePrs({
      days: '30',
      only_labels: 'feature'
    });

    expect(octokit.issues.addLabels).toHaveBeenCalledTimes(1);
    expect(octokit.issues.addLabels).toHaveBeenCalledWith({
      ...context.repo,
      issue_number: 1,
      labels: ['stale']
    });
    expect(result.summary.staled).toBe(1);
    expect(result.summary.skipped).toBe(1);
  });

  it('should respect operations_per_run limit', async () => {
    const mockPrs: MockPullRequest[] = Array.from({ length: 5 }, (_, i) => ({
      number: i + 1,
      updated_at: thirtyDaysAgo.toISOString(),
      draft: false,
      user: { login: `user${i + 1}` },
      labels: []
    }));

    mockPaginateAllOpenPullRequests.mockResolvedValue(mockPrs as PullRequestList);

    const result = await stalePrs({
      days: '30',
      operations_per_run: '2'
    });

    expect(octokit.issues.addLabels).toHaveBeenCalledTimes(2);
    expect(result.summary.operations_performed).toBe(2);
  });

  it('should sort PRs by updated date descending by default', async () => {
    const mockPrs: MockPullRequest[] = [
      {
        number: 1,
        updated_at: '2023-01-20T10:00:00Z', // older
        draft: false,
        user: { login: 'user1' },
        labels: []
      },
      {
        number: 2,
        updated_at: '2023-01-22T10:00:00Z', // newer
        draft: false,
        user: { login: 'user2' },
        labels: []
      }
    ];

    mockPaginateAllOpenPullRequests.mockResolvedValue(mockPrs as PullRequestList);

    await stalePrs({
      days: '30',
      operations_per_run: '1'
    });

    // Should process PR #2 first (newer date, descending order)
    expect(octokit.issues.addLabels).toHaveBeenCalledWith({
      ...context.repo,
      issue_number: 2,
      labels: ['stale']
    });
  });

  it('should sort PRs by updated date ascending when specified', async () => {
    const mockPrs: MockPullRequest[] = [
      {
        number: 1,
        updated_at: '2023-01-20T10:00:00Z', // older
        draft: false,
        user: { login: 'user1' },
        labels: []
      },
      {
        number: 2,
        updated_at: '2023-01-22T10:00:00Z', // newer
        draft: false,
        user: { login: 'user2' },
        labels: []
      }
    ];

    mockPaginateAllOpenPullRequests.mockResolvedValue(mockPrs as PullRequestList);

    await stalePrs({
      days: '30',
      operations_per_run: '1',
      ascending: 'true'
    });

    // Should process PR #1 first (older date, ascending order)
    expect(octokit.issues.addLabels).toHaveBeenCalledWith({
      ...context.repo,
      issue_number: 1,
      labels: ['stale']
    });
  });
});
