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
import * as core from '@actions/core';
import { setCommitStatus } from '../../src/helpers/set-commit-status';
import { paginateAllOpenPullRequests } from '../../src/utils/paginate-open-pull-requests';

const branchName = 'some-branch-name';

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
        get: jest.fn(() => ({ data: { base: { repo: { default_branch: 'main' } }, head: { ref: branchName } } }))
      }
    }
  }))
}));

describe('checkMergeSafety', () => {
  it('should throw error when branch is out of date on the provided project path', async () => {
    (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockImplementation(async ({ basehead }) => {
      const changedFiles =
        basehead === 'some-branch-name...main'
          ? ['packages/package-1/src/file1.ts', 'packages/package-2']
          : ['README.md', 'packages/package-1/src/file2.ts'];
      return {
        data: {
          files: changedFiles.map(file => ({ filename: file }))
        }
      };
    });
    await expect(
      checkMergeSafety({
        paths: 'packages/package-1',
        ...context.repo
      })
    ).rejects.toThrowError();
    expect(core.error).toHaveBeenCalledWith(
      'This branch has one or more outdated projects which are being changed in this PR. Please update "some-branch-name" with the "main" branch.'
    );
  });

  it('should not throw error when branch is fully up to date', async () => {
    (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockImplementation(async ({ basehead }) => {
      const changedFiles = basehead === 'some-branch-name...main' ? [] : ['README.md', 'packages/package-1/src/file2.ts'];
      return {
        data: {
          files: changedFiles.map(file => ({ filename: file }))
        }
      };
    });
    await expect(
      checkMergeSafety({
        paths: 'packages/package-1',
        ...context.repo
      })
    ).resolves.not.toThrowError();
    expect(core.error).not.toHaveBeenCalled();
  });

  it('should throw error when branch is out of date on override filter paths, even when project paths are up to date', async () => {
    (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockImplementation(async ({ basehead }) => {
      const changedFiles =
        basehead === 'some-branch-name...main'
          ? ['packages/package-1/src/file1.ts', 'package.json']
          : ['README.md', 'packages/package-3/src/file3.ts'];
      return {
        data: {
          files: changedFiles.map(file => ({ filename: file }))
        }
      };
    });
    await expect(
      checkMergeSafety({
        paths: 'packages/package-1',
        override_filter_paths: 'package.json\npackage-lock.json',
        ...context.repo
      })
    ).rejects.toThrowError();
    expect(core.error).toHaveBeenCalledWith(
      'This branch has one or more outdated files that must be rebased on! Please update "some-branch-name" with the "main" branch.'
    );
  });

  it('should throw error when branch is out of date on override glob paths, even when project paths are up to date', async () => {
    (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockImplementation(async ({ basehead }) => {
      const changedFiles =
        basehead === 'some-branch-name...main'
          ? ['packages/package-1/src/file1.ts', 'package.json']
          : ['README.md', 'packages/package-3/src/file3.ts'];
      return {
        data: {
          files: changedFiles.map(file => ({ filename: file }))
        }
      };
    });
    await expect(
      checkMergeSafety({
        paths: 'packages/package-1',
        override_filter_globs: 'packages/**',
        ...context.repo
      })
    ).rejects.toThrowError();
    expect(core.error).toHaveBeenCalledWith(
      'This branch has one or more outdated files that must be rebased on! Please update "some-branch-name" with the "main" branch.'
    );
  });

  it('should not throw error when project paths are up to date', async () => {
    (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockImplementation(async ({ basehead }) => {
      const changedFiles =
        basehead === 'some-branch-name...main'
          ? ['packages/package-1/src/file1.ts', 'packages/package-2/src/file2.ts']
          : ['README.md', 'packages/package-3/src/file3.ts'];
      return {
        data: {
          files: changedFiles.map(file => ({ filename: file }))
        }
      };
    });
    await expect(
      checkMergeSafety({
        paths: 'packages/package-1',
        ...context.repo
      })
    ).resolves.not.toThrowError();
    expect(core.error).not.toHaveBeenCalled();
  });

  it('should set merge safety commit status on all open prs', async () => {
    (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockImplementation(async ({ basehead }) => {
      const changedFiles =
        basehead === 'some-branch-name...main'
          ? ['packages/package-1/src/file1.ts', 'packages/package-2/src/file2.ts']
          : ['README.md', 'packages/package-3/src/file3.ts'];
      return {
        data: {
          files: changedFiles.map(file => ({ filename: file }))
        }
      };
    });
    // eslint-disable-next-line functional/immutable-data,@typescript-eslint/no-explicit-any
    context.issue.number = undefined as any; // couldn't figure out a way to mock out this issue number in a cleaner way ¯\_(ツ)_/¯
    (paginateAllOpenPullRequests as jest.Mock).mockResolvedValue([
      { head: { sha: '123' }, base: { repo: { default_branch: 'main' } } },
      { head: { sha: '456' }, base: { repo: { default_branch: 'main' } } }
    ]);
    await checkMergeSafety({
      paths: 'packages/package-1',
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha: '123',
      state: 'success',
      context: 'Merge Safety',
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha: '456',
      state: 'success',
      context: 'Merge Safety',
      ...context.repo
    });
  });
});
