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
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: mock(() => mockOctokit)
}));

mock.module('../../src/octokit', () => ({
  octokit: mockOctokit.rest,
  octokitGraphql: mockOctokit.graphql
}));

const mockGitInstance = {
  checkoutLocalBranch: mock(() => mockGitInstance),
  add: mock(() => mockGitInstance),
  commit: mock(() => mockGitInstance),
  push: mock(() => mockGitInstance),
  addConfig: mock(() => mockGitInstance)
};

const mockSimpleGit = mock(() => mockGitInstance) as any;
mockSimpleGit.__mockGitInstance = mockGitInstance;

mock.module('simple-git', () => ({
  simpleGit: mockSimpleGit,
  default: mockSimpleGit
}));

const { checkMergeSafety } = await import('../../src/helpers/check-merge-safety');
const { octokit } = await import('../../src/octokit');
const { setCommitStatus } = await import('../../src/helpers/set-commit-status');
const { paginateAllOpenPullRequests } = await import('../../src/utils/paginate-open-pull-requests');
const { context } = await import('@actions/github');

const branchName = 'some-branch-name';
const username = 'username';
const baseOwner = 'owner';
const defaultBranch = 'main';
const baseRepoHtmlUrl = 'baseRepoHtmlUrl';
const headRepoHtmlUrl = 'headRepoHtmlUrl';
const baseSha = 'baseSha';
const sha = 'sha';

  return { simpleGit: jest.fn(() => mockSimpleGit) };
});

      },
      pulls: {
        get: jest.fn(() => ({
          data: {
            base: { repo: { default_branch: defaultBranch, owner: { login: baseOwner }, html_url: baseRepoHtmlUrl }, sha: baseSha },
            head: { sha, ref: branchName, user: { login: username }, repo: { html_url: headRepoHtmlUrl } }
          }
        }))
      }
    }
  }))

type MockGithubRequests = (
  filesOutOfDate: string[],
  changedFilesOnPr: string[],
  branch?: string,
  error?: { status: number | string; message?: string } | null
) => void;
const mockGithubRequests: MockGithubRequests = (filesOutOfDate, changedFilesOnPr, branch = branchName, error = null) => {
  (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockImplementation(async ({ basehead }) => {
    const changedFiles = basehead === `${username}:${branch}...${baseOwner}:${defaultBranch}` ? filesOutOfDate : changedFilesOnPr;
    return error
      ? error
      : {
          data: {
            files: changedFiles.map(file => ({ filename: file }))
          }
        };
  });
};

type MockGitInteractions = Partial<Record<'diff' | 'fetch', number>>;
const mockGitInteractions = (filesOutOfDate: string[], changedFilesOnPr: string[], whichCallToFail: MockGitInteractions = {}) => {
  const diffHandler = (diffOptions = []) => {
    const changedFiles = Array.isArray(diffOptions) && diffOptions[1] === 'sha' ? filesOutOfDate : changedFilesOnPr;
    return changedFiles.join('\n');
  };

  const diff = simpleGit().diff as Mock<any>;
  diff.mockImplementation(diffHandler);
  if (typeof whichCallToFail.diff === 'number') {
    Array(whichCallToFail.diff)
      .fill(1)
      .forEach((_, i, arr) =>
        i === arr.length - 1 ? diff.mockRejectedValueOnce(new Error('mock diff error')) : diff.mockImplementationOnce(diffHandler)
      );
  }

  const fetch = simpleGit().fetch as Mock<any>;
  fetch.mockImplementation(() => 'new fetch value');
  if (typeof whichCallToFail.fetch === 'number') {
    Array(whichCallToFail.fetch)
      .fill(1)
      .forEach((_, i, arr) =>
        i === arr.length - 1
          ? fetch.mockRejectedValueOnce(new Error(`mock fetch error`))
          : fetch.mockImplementationOnce(() => 'new fetch value')
      );
  }
};

const allProjectPaths = ['packages/package-1/', 'packages/package-2/', 'packages/package-3/'].join('\n');

describe('checkMergeSafety', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    (octokit.repos.getCombinedStatusForRef as unknown as Mock<any>).mockResolvedValue({
      data: { state: 'success', statuses: [] }
    });
  });

  it('should prevent merge when branch is out of date for a changed project', async () => {
    const filesOutOfDate = ['packages/package-1/src/another-file.ts'];
    const changedFilesOnPr = ['packages/package-1/src/some-file.ts'];
    mockGithubRequests(filesOutOfDate, changedFilesOnPr);
    await checkMergeSafety({
      paths: allProjectPaths,
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha,
      state: 'failure',
      context: 'Merge Safety',
      description: 'This branch has one or more outdated projects. Please update with main.',
      repo: 'repo',
      owner: 'owner'
    });
    expect(core.setFailed).toHaveBeenCalledWith('This branch has one or more outdated projects. Please update with main.');
  });

  it('should allow merge when branch is only out of date for an unchanged project - diff too large error status', async () => {
    const filesOutOfDate = ['packages/package-2/src/another-file.ts'];
    const changedFilesOnPr = ['packages/package-1/src/some-file.ts'];
    mockGithubRequests(filesOutOfDate, changedFilesOnPr, branchName, { status: 406 });
    mockGitInteractions(filesOutOfDate, changedFilesOnPr);

    await checkMergeSafety({
      paths: allProjectPaths,
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha,
      state: 'success',
      context: 'Merge Safety',
      description: 'Branch username:some-branch-name is safe to merge!',
      repo: 'repo',
      owner: 'owner'
    });
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('should allow merge when branch is only out of date for an unchanged project - diff too large error message', async () => {
    const filesOutOfDate = ['packages/package-2/src/another-file.ts'];
    const changedFilesOnPr = ['packages/package-1/src/some-file.ts'];
    mockGithubRequests(filesOutOfDate, changedFilesOnPr, branchName, {
      status: 'not_available',
      message: 'yadda yadda diff is taking too long to generate yadda yadda'
    });
    mockGitInteractions(filesOutOfDate, changedFilesOnPr);

    await checkMergeSafety({
      paths: allProjectPaths,
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha,
      state: 'success',
      context: 'Merge Safety',
      description: 'Branch username:some-branch-name is safe to merge!',
      repo: 'repo',
      owner: 'owner'
    });
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('should prevent merge when branch is out of date for a changed project - diff too large error', async () => {
    const filesOutOfDate = ['packages/package-1/src/another-file.ts'];
    const changedFilesOnPr = ['packages/package-1/src/some-file.ts'];
    mockGithubRequests(filesOutOfDate, changedFilesOnPr, branchName, { status: 406 });
    mockGitInteractions(filesOutOfDate, changedFilesOnPr);

    await checkMergeSafety({
      paths: allProjectPaths,
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha,
      state: 'failure',
      context: 'Merge Safety',
      description: 'This branch has one or more outdated projects. Please update with main.',
      repo: 'repo',
      owner: 'owner'
    });
    expect(core.setFailed).toHaveBeenCalledWith('This branch has one or more outdated projects. Please update with main.');
  });

  it.each([
    {
      whichCallToFail: 1,
      baseHead: 'username:some-branch-name...owner:main',
      repoUrl: headRepoHtmlUrl
    },
    {
      whichCallToFail: 2,
      baseHead: 'owner:main...username:some-branch-name',
      repoUrl: baseRepoHtmlUrl
    }
  ])('should prevent merge when diff fails - diff too large error', async ({ whichCallToFail, baseHead, repoUrl }) => {
    const filesOutOfDate = ['packages/package-1/src/another-file.ts'];
    const changedFilesOnPr = ['packages/package-1/src/some-file.ts'];
    mockGithubRequests(filesOutOfDate, changedFilesOnPr, branchName, { status: 406 });
    mockGitInteractions(filesOutOfDate, changedFilesOnPr, { diff: whichCallToFail });
    const description = `Failed to generate diff for ${baseHead}. Please verify SHAs are valid and try again.\nError: Failed to run local git diff for ${repoUrl}: mock diff error`;

    await checkMergeSafety({
      paths: allProjectPaths,
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha,
      state: 'failure',
      context: 'Merge Safety',
      description,
      repo: 'repo',
      owner: 'owner'
    });
    expect(core.setFailed).toHaveBeenCalledWith(description);
  });

  it.each([
    {
      whichCallToFail: 1,
      baseHead: 'username:some-branch-name...owner:main',
      targetSha: sha,
      repoUrl: headRepoHtmlUrl
    },
    {
      whichCallToFail: 2,
      baseHead: 'username:some-branch-name...owner:main',
      targetSha: baseSha,
      repoUrl: headRepoHtmlUrl
    },
    {
      whichCallToFail: 3,
      baseHead: 'owner:main...username:some-branch-name',
      targetSha: baseSha,
      repoUrl: baseRepoHtmlUrl
    },
    {
      whichCallToFail: 4,
      baseHead: 'owner:main...username:some-branch-name',
      targetSha: sha,
      repoUrl: baseRepoHtmlUrl
    }
  ])('should prevent merge when fetch fails - diff too large error', async ({ whichCallToFail, baseHead, targetSha, repoUrl }) => {
    const filesOutOfDate = ['packages/package-1/src/another-file.ts'];
    const changedFilesOnPr = ['packages/package-1/src/some-file.ts'];
    mockGithubRequests(filesOutOfDate, changedFilesOnPr, branchName, { status: 406 });
    mockGitInteractions(filesOutOfDate, changedFilesOnPr, { fetch: whichCallToFail });
    const description = `Failed to generate diff for ${baseHead}. Please verify SHAs are valid and try again.\nError: Failed to fetch ${targetSha} from ${repoUrl}: mock fetch error`;

    await checkMergeSafety({
      paths: allProjectPaths,
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha,
      state: 'failure',
      context: 'Merge Safety',
      description,
      repo: 'repo',
      owner: 'owner'
    });
    expect(core.setFailed).toHaveBeenCalledWith(description);
  });

  it('should allow merge when branch is only out of date for an unchanged project', async () => {
    const filesOutOfDate = ['packages/package-2/src/another-file.ts'];
    const changedFilesOnPr = ['packages/package-1/src/some-file.ts'];
    mockGithubRequests(filesOutOfDate, changedFilesOnPr);
    await checkMergeSafety({
      paths: allProjectPaths,
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha,
      state: 'success',
      context: 'Merge Safety',
      description: 'Branch username:some-branch-name is safe to merge!',
      repo: 'repo',
      owner: 'owner'
    });
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('should allow merge when branch is fully up to date', async () => {
    const filesOutOfDate: string[] = [];
    const changedFilesOnPr = ['packages/package-1/src/some-file.ts'];
    mockGithubRequests(filesOutOfDate, changedFilesOnPr);

    await checkMergeSafety({
      paths: allProjectPaths,
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha,
      state: 'success',
      context: 'Merge Safety',
      description: 'Branch username:some-branch-name is safe to merge!',
      repo: 'repo',
      owner: 'owner'
    });
  });

  it('should skip setting merge safety commit status when a PR already has the failure context set', async () => {
    const filesOutOfDate = ['packages/package-1/src/another-file.ts'];
    const changedFilesOnPr = ['packages/package-1/src/some-file.ts'];
    mockGithubRequests(filesOutOfDate, changedFilesOnPr);
    (octokit.repos.getCombinedStatusForRef as unknown as Mock<any>).mockResolvedValue({
      data: { state: 'failure', statuses: [{ context: 'Merge Safety' }] }
    });
    await checkMergeSafety({
      paths: allProjectPaths,
      ...context.repo
    });
    expect(setCommitStatus).not.toHaveBeenCalled();
    expect(core.setFailed).toHaveBeenCalledWith('This branch has one or more outdated projects. Please update with main.');
  });

  it('should not skip setting merge safety commit status when context state changes', async () => {
    const filesOutOfDate = ['packages/package-1/src/another-file.ts'];
    const changedFilesOnPr = ['packages/package-1/src/some-file.ts'];
    mockGithubRequests(filesOutOfDate, changedFilesOnPr);
    (octokit.repos.getCombinedStatusForRef as unknown as Mock<any>).mockResolvedValue({
      data: { state: 'success', statuses: [{ context: 'Merge Safety' }] }
    });
    await checkMergeSafety({
      paths: allProjectPaths,
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha,
      state: 'failure',
      context: 'Merge Safety',
      description: 'This branch has one or more outdated projects. Please update with main.',
      repo: 'repo',
      owner: 'owner'
    });
    expect(core.setFailed).toHaveBeenCalledWith('This branch has one or more outdated projects. Please update with main.');
  });

  it('should prevent merge when branch is out of date on override filter paths, even when changed project paths are up to date', async () => {
    const filesOutOfDate = ['packages/package-2/src/file1.ts', 'package.json'];
    const changedFilesOnPr = ['packages/package-1/src/some-file.ts'];
    mockGithubRequests(filesOutOfDate, changedFilesOnPr);
    await checkMergeSafety({
      paths: allProjectPaths,
      override_filter_paths: 'package.json\npackage-lock.json',
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha,
      state: 'failure',
      context: 'Merge Safety',
      description: 'This branch has one or more outdated global files. Please update with main.',
      repo: 'repo',
      owner: 'owner'
    });
  });

  it('should prevent merge when branch is out of date on override glob paths, even when changed project paths are up to date', async () => {
    const filesOutOfDate = ['packages/package-2/src/file1.ts', 'README.md'];
    const changedFilesOnPr = ['packages/package-1/src/some-file.ts'];
    mockGithubRequests(filesOutOfDate, changedFilesOnPr);
    await checkMergeSafety({
      paths: allProjectPaths,
      override_filter_globs: '**.md',
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha,
      state: 'failure',
      context: 'Merge Safety',
      description: 'This branch has one or more outdated global files. Please update with main.',
      repo: 'repo',
      owner: 'owner'
    });
  });

  it('should prevent merge when branch is out of date on override glob paths using negation glob pattern', async () => {
    const filesOutOfDate = ['README.md'];
    const changedFilesOnPr = ['packages/package-1/src/some-file.ts'];
    mockGithubRequests(filesOutOfDate, changedFilesOnPr);
    await checkMergeSafety({
      paths: allProjectPaths,
      override_filter_globs: '!packages/**',
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha,
      state: 'failure',
      context: 'Merge Safety',
      description: 'This branch has one or more outdated global files. Please update with main.',
      repo: 'repo',
      owner: 'owner'
    });
  });

  it('should allow merge when branch is not out of date on paths ignore globs', async () => {
    const filesOutOfDate = ['packages/package-1/sub-dir/package.json'];
    const changedFilesOnPr = ['packages/package-1/sub-dir/package.json'];
    mockGithubRequests(filesOutOfDate, changedFilesOnPr);
    await checkMergeSafety({
      paths: allProjectPaths,
      ignore_globs: 'packages/**/package.json',
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha,
      state: 'success',
      context: 'Merge Safety',
      description: 'Branch username:some-branch-name is safe to merge!',
      repo: 'repo',
      owner: 'owner'
    });
  });

  it('should set merge safety status with truncated description length if branch name is too long', async () => {
    const reallyLongBranchName = 'x'.repeat(200);
    (octokit.pulls.get as unknown as Mocktokit).mockImplementation(() => ({
      data: {
        base: { repo: { default_branch: defaultBranch, owner: { login: baseOwner } } },
        head: { sha, ref: reallyLongBranchName, user: { login: username } }
      }
    }));
    const filesOutOfDate = ['packages/package-1/sub-dir/package.json'];
    const changedFilesOnPr = ['packages/package-1/sub-dir/package.json'];
    mockGithubRequests(filesOutOfDate, changedFilesOnPr, reallyLongBranchName);
    await checkMergeSafety({
      paths: allProjectPaths,
      ignore_globs: 'packages/**/package.json',
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha,
      state: 'success',
      context: 'Merge Safety',
      description: `Branch username:${'x'.repeat(50)}... is safe to merge!`,
      repo: 'repo',
      owner: 'owner'
    });
  });

  it('should set merge safety commit status on all open prs', async () => {
    const filesOutOfDate = ['packages/package-2/src/file1.ts', 'packages/package-3/src/file2.ts'];
    const changedFilesOnPr = ['packages/package-1/src/some-file.ts'];
    mockGithubRequests(filesOutOfDate, changedFilesOnPr);
    context.issue.number = undefined as unknown as number; // couldn't figure out a way to mock out this issue number in a cleaner way ¯\_(ツ)_/¯
    (paginateAllOpenPullRequests as Mock<any>).mockResolvedValue([
      {
        head: { sha: '123', ref: branchName, user: { login: username } },
        base: { ref: defaultBranch, repo: { default_branch: defaultBranch, owner: { login: baseOwner } } }
      },
      {
        head: { sha: '456', ref: branchName, user: { login: username } },
        base: { ref: defaultBranch, repo: { default_branch: defaultBranch, owner: { login: baseOwner } } }
      },
      {
        head: { sha: '789', ref: branchName, user: { login: username } },
        base: { ref: 'some-other-branch', repo: { default_branch: defaultBranch, owner: { login: baseOwner } } }
      },
      {
        head: { sha: '000', ref: branchName, user: { login: username } },
        base: { ref: defaultBranch, repo: { default_branch: defaultBranch, owner: { login: baseOwner } } },
        draft: true
      }
    ]);
    await checkMergeSafety({
      paths: allProjectPaths,
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha: '123',
      state: 'success',
      context: 'Merge Safety',
      description: 'Branch username:some-branch-name is safe to merge!',
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha: '456',
      state: 'success',
      context: 'Merge Safety',
      description: 'Branch username:some-branch-name is safe to merge!',
      ...context.repo
    });
    expect(setCommitStatus).not.toHaveBeenCalledWith({
      sha: '789',
      state: 'success',
      context: 'Merge Safety',
      description: 'Branch username:some-branch-name is safe to merge!',
      ...context.repo
    });
    expect(setCommitStatus).not.toHaveBeenCalledWith({
      sha: '000',
      state: 'success',
      context: 'Merge Safety',
      description: 'Branch username:some-branch-name is safe to merge!',
      ...context.repo
    });
  });
});
