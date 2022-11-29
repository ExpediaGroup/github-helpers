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
            base: { repo: { default_branch: 'main', owner: { login: 'owner' } } },
            head: { ref: branchName, user: { login: 'username' } }
          }
        }))
      }
    }
  }))
}));

describe('checkMergeSafety', () => {
  it('should throw error when branch is out of date on the provided project path', async () => {
    const filesOutOfDate = ['packages/some-package/src/file1.ts', 'packages/another-package/src/file.ts'];
    (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockResolvedValue({
      data: {
        files: filesOutOfDate.map(file => ({ filename: file }))
      }
    });
    await expect(
      checkMergeSafety({
        paths: 'packages/some-package/',
        ...context.repo
      })
    ).rejects.toThrowError('This branch has one or more outdated projects. Please update with main.');
  });

  it('should throw error when branch is out of date on a co-dependent project path', async () => {
    const filesOutOfDate = ['packages/co-dependent-package-2/src/file.ts'];
    (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockResolvedValue({
      data: {
        files: filesOutOfDate.map(file => ({ filename: file }))
      }
    });
    await expect(
      checkMergeSafety({
        paths: 'packages/co-dependent-package-1/\npackages/co-dependent-package-2/',
        ...context.repo
      })
    ).rejects.toThrowError('This branch has one or more outdated projects. Please update with main.');
  });

  it('should not throw error when branch is only out of date on a non-dependent project path', async () => {
    const filesOutOfDate = ['packages/other-package/src/file1.ts'];
    (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockResolvedValue({
      data: {
        files: filesOutOfDate.map(file => ({ filename: file }))
      }
    });
    await expect(
      checkMergeSafety({
        paths: 'packages/package-with-no-dependencies',
        ...context.repo
      })
    ).resolves.not.toThrowError();
  });

  it('should not throw error when branch is fully up to date', async () => {
    const filesOutOfDate: string[] = [];
    (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockResolvedValue({
      data: {
        files: filesOutOfDate
      }
    });
    await expect(
      checkMergeSafety({
        paths: 'packages/any-package',
        ...context.repo
      })
    ).resolves.not.toThrowError();
  });

  it('should throw error when branch is out of date on override filter paths, even when project paths are up to date', async () => {
    const filesOutOfDate = ['packages/other-package/src/file1.ts', 'package.json'];
    (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockResolvedValue({
      data: {
        files: filesOutOfDate.map(file => ({ filename: file }))
      }
    });
    await expect(
      checkMergeSafety({
        paths: 'packages/some-package',
        override_filter_paths: 'package.json\npackage-lock.json',
        ...context.repo
      })
    ).rejects.toThrowError('This branch has one or more outdated global files. Please update with main.');
  });

  it('should throw error when branch is out of date on override glob paths, even when project paths are up to date', async () => {
    const filesOutOfDate = ['packages/other-package/src/file1.ts', 'README.md'];
    (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockResolvedValue({
      data: {
        files: filesOutOfDate.map(file => ({ filename: file }))
      }
    });
    await expect(
      checkMergeSafety({
        paths: 'packages/some-package',
        override_filter_globs: 'packages/**',
        ...context.repo
      })
    ).rejects.toThrowError('This branch has one or more outdated global files. Please update with main.');
  });

  it('should set merge safety commit status on all open prs', async () => {
    const filesOutOfDate = ['packages/other-package/src/file1.ts', 'packages/another-package/src/file2.ts'];
    (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockResolvedValue({
      data: {
        files: filesOutOfDate.map(file => ({ filename: file }))
      }
    });
    // eslint-disable-next-line functional/immutable-data,@typescript-eslint/no-explicit-any
    context.issue.number = undefined as any; // couldn't figure out a way to mock out this issue number in a cleaner way ¯\_(ツ)_/¯
    (paginateAllOpenPullRequests as jest.Mock).mockResolvedValue([
      {
        head: { sha: '123', user: { login: 'owner' } },
        base: { ref: 'main', repo: { default_branch: 'main', owner: { login: 'owner' } } }
      },
      {
        head: { sha: '456', user: { login: 'owner' } },
        base: { ref: 'main', repo: { default_branch: 'main', owner: { login: 'owner' } } }
      },
      {
        head: { sha: '789', user: { login: 'owner' } },
        base: { ref: 'some-other-branch', repo: { default_branch: 'main', owner: { login: 'owner' } } }
      },
      {
        head: { sha: '000', user: { login: 'owner' } },
        base: { ref: 'main', repo: { default_branch: 'main', owner: { login: 'owner' } } },
        draft: true
      }
    ]);
    await checkMergeSafety({
      paths: 'packages/some-package',
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha: '123',
      state: 'success',
      context: 'Merge Safety',
      description: 'This branch is safe to merge!',
      ...context.repo
    });
    expect(setCommitStatus).toHaveBeenCalledWith({
      sha: '456',
      state: 'success',
      context: 'Merge Safety',
      description: 'This branch is safe to merge!',
      ...context.repo
    });
    expect(setCommitStatus).not.toHaveBeenCalledWith({
      sha: '789',
      state: 'success',
      context: 'Merge Safety',
      description: 'This branch is safe to merge!',
      ...context.repo
    });
    expect(setCommitStatus).not.toHaveBeenCalledWith({
      sha: '000',
      state: 'success',
      context: 'Merge Safety',
      description: 'This branch is safe to merge!',
      ...context.repo
    });
  });
});
