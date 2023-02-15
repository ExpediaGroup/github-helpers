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

import { Mocktokit } from '../types';
import { context } from '@actions/github';
import { checkMergeSafety } from '../../src/helpers/check-merge-safety';
import { octokit } from '../../src/octokit';
import { setCommitStatus } from '../../src/helpers/set-commit-status';
import { paginateAllOpenPullRequests } from '../../src/utils/paginate-open-pull-requests';

const branchName = 'some-branch-name';
const username = 'username';
const baseOwner = 'owner';
const defaultBranch = 'main';
const sha = 'sha';

jest.mock('../../src/utils/paginate-open-pull-requests');
jest.mock('../../src/helpers/set-commit-status');
jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      repos: {
        compareCommitsWithBasehead: jest.fn()
      },
      pulls: {
        get: jest.fn(() => ({
          data: {
            base: { repo: { default_branch: defaultBranch, owner: { login: baseOwner } } },
            head: { sha, ref: branchName, user: { login: username } }
          }
        }))
      }
    }
  }))
}));

const mockGithubRequests = (filesOutOfDate: string[], changedFilesOnPr: string[]) => {
  (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockImplementation(async ({ basehead }) => {
    const changedFiles = basehead === `${username}:${branchName}...${baseOwner}:${defaultBranch}` ? filesOutOfDate : changedFilesOnPr;
    return {
      data: {
        files: changedFiles.map(file => ({ filename: file }))
      }
    };
  });
};

const allProjectPaths = ['packages/package-1/', 'packages/package-2/', 'packages/package-3/'].join('\n');

describe('checkMergeSafety', () => {
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

  it('should set merge safety commit status on all open prs', async () => {
    const filesOutOfDate = ['packages/package-2/src/file1.ts', 'packages/package-3/src/file2.ts'];
    const changedFilesOnPr = ['packages/package-1/src/some-file.ts'];
    mockGithubRequests(filesOutOfDate, changedFilesOnPr);
    // eslint-disable-next-line functional/immutable-data,@typescript-eslint/no-explicit-any
    context.issue.number = undefined as any; // couldn't figure out a way to mock out this issue number in a cleaner way ¯\_(ツ)_/¯
    (paginateAllOpenPullRequests as jest.Mock).mockResolvedValue([
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
