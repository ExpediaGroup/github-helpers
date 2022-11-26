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

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      repos: {
        get: jest.fn(() => ({ data: { default_branch: 'master' } })),
        compareCommitsWithBasehead: jest.fn()
      }
    }
  }))
}));

const base = 'some-branch-name';

describe('checkMergeSafety', () => {
  it('should throw error when changed files intersect', async () => {
    (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockImplementation(async ({ basehead }) => {
      const changedFiles = basehead.startsWith(base)
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
        base,
        paths: 'packages/package-1',
        ...context.repo
      })
    ).rejects.toThrowError('Please update some-branch-name with master');
  });

  it('should throw error when override files match even when files do not intersect', async () => {
    (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockImplementation(async ({ basehead }) => {
      const changedFiles = basehead.startsWith(base)
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
        base,
        paths: 'packages/package-1',
        override_filter_paths: 'package.json\npackage-lock.json',
        ...context.repo
      })
    ).rejects.toThrowError('Please update some-branch-name with master');
  });

  it('should throw error when override globs match even when files do not intersect', async () => {
    (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockImplementation(async ({ basehead }) => {
      const changedFiles = basehead.startsWith(base)
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
        base,
        paths: 'packages/package-1',
        override_filter_globs: 'packages/**',
        ...context.repo
      })
    ).rejects.toThrowError('Please update some-branch-name with master');
  });

  it('should not throw error when changed files do not intersect', async () => {
    (octokit.repos.compareCommitsWithBasehead as unknown as Mocktokit).mockImplementation(async ({ basehead }) => {
      const changedFiles = basehead.startsWith(base)
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
        base,
        paths: 'packages/package-1',
        ...context.repo
      })
    ).resolves.not.toThrowError();
  });
});
