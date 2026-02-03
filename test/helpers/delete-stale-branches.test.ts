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

import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

const { deleteStaleBranches } = await import('../../src/helpers/delete-stale-branches');
const { octokit } = await import('../../src/octokit');
const { context } = await import('@actions/github');
const paginateOpenPullRequestsModule = await import('../../src/utils/paginate-open-pull-requests');
const paginateAllBranchesModule = await import('../../src/utils/paginate-all-branches');
const getDefaultBranchModule = await import('../../src/utils/get-default-branch');

describe('deleteStaleBranches', () => {
  let paginateAllOpenPullRequestsSpy: ReturnType<typeof spyOn>;
  let paginateAllBranchesSpy: ReturnType<typeof spyOn>;
  let getDefaultBranchSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    paginateAllOpenPullRequestsSpy = spyOn(paginateOpenPullRequestsModule, 'paginateAllOpenPullRequests').mockResolvedValue([
      {
        head: { ref: 'branch-with-open-pr', sha: 'sha-pr-1' },
        base: { ref: 'main', repo: { default_branch: 'main', owner: { login: 'owner' } } },
        number: 1,
        labels: []
      },
      {
        head: { ref: 'some-other-branch', sha: 'sha-pr-2' },
        base: { ref: 'main', repo: { default_branch: 'main', owner: { login: 'owner' } } },
        number: 2,
        labels: []
      }
    ] as any);

    paginateAllBranchesSpy = spyOn(paginateAllBranchesModule, 'paginateAllBranches').mockResolvedValue([
      { name: 'main', commit: { sha: 'sha1' } },
      { name: 'new-branch-no-open-pr', commit: { sha: 'sha2' } },
      { name: 'old-branch-with-no-open-pr', commit: { sha: 'sha3' } },
      { name: 'branch-with-open-pr', commit: { sha: 'sha4' } }
    ] as any);

    getDefaultBranchSpy = spyOn(getDefaultBranchModule, 'getDefaultBranch').mockResolvedValue('main');
  });

  afterEach(() => {
    paginateAllOpenPullRequestsSpy.mockRestore();
    paginateAllBranchesSpy.mockRestore();
    getDefaultBranchSpy.mockRestore();
  });

  it('should call octokit deleteRef with correct branch names', async () => {
    // Mock octokit.git.getCommit to return dates
    (octokit.git.getCommit as any).mockImplementation(async ({ commit_sha }: { commit_sha: string }) => {
      const dates: Record<string, string> = {
        sha2: new Date().toISOString(), // new-branch-no-open-pr - recent date
        sha3: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // old-branch - 2 days ago
      };
      return {
        data: {
          committer: {
            date: dates[commit_sha] || new Date().toISOString()
          }
        }
      };
    });

    await deleteStaleBranches({ days: '1' });

    expect(octokit.git.deleteRef).not.toHaveBeenCalledWith({
      ref: 'heads/main',
      ...context.repo
    });
    expect(octokit.git.deleteRef).not.toHaveBeenCalledWith({
      ref: 'heads/new-branch-no-open-pr',
      ...context.repo
    });
    expect(octokit.git.deleteRef).not.toHaveBeenCalledWith({
      ref: 'heads/branch-with-open-pr',
      ...context.repo
    });
    expect(octokit.git.deleteRef).toHaveBeenCalledWith({
      ref: 'heads/old-branch-with-no-open-pr',
      ...context.repo
    });
  });
});
