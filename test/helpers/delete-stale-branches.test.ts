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
import { deleteStaleBranches } from '../../src/helpers/delete-stale-branches';
import { octokit } from '../../src/octokit';
import { paginateAllOpenPullRequests } from '../../src/utils/paginate-open-pull-requests';

jest.mock('../../src/utils/paginate-open-pull-requests');
jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({
    rest: {
      git: {
        deleteRef: jest.fn(),
        getCommit: jest.fn().mockImplementation(({ commit_sha }) =>
          commit_sha === '123'
            ? {
                data: { committer: { date: '2023-02-23T11:00:00Z' } }
              }
            : {
                data: { committer: { date: '2023-02-23T09:00:00Z' } }
              }
        )
      },
      repos: {
        listBranches: jest.fn().mockImplementation(({ page }) =>
          page === 1
            ? {
                data: [
                  { name: 'new-branch-no-open-pr', commit: { sha: '123' } },
                  { name: 'old-branch-with-no-open-pr', commit: { sha: '456' } },
                  { name: 'branch-with-open-pr', commit: { sha: '789' } }
                ]
              }
            : { data: [] }
        )
      }
    }
  }))
}));
(paginateAllOpenPullRequests as jest.Mock).mockResolvedValue([
  { head: { ref: 'branch-with-open-pr' } },
  { head: { ref: 'some-other-branch' } }
]);
jest.spyOn(Date, 'now').mockImplementation(() => new Date('2023-02-24T10:00:00Z').getTime());

describe('deleteStaleBranches', () => {
  it('should call octokit deleteRef with correct branch names', async () => {
    await deleteStaleBranches({ days: '1' });

    expect(octokit.git.deleteRef).not.toHaveBeenCalledWith({
      ref: 'new-branch-no-open-pr',
      ...context.repo
    });
    expect(octokit.git.deleteRef).not.toHaveBeenCalledWith({
      ref: 'branch-with-open-pr',
      ...context.repo
    });
    expect(octokit.git.deleteRef).toHaveBeenCalledWith({
      ref: 'old-branch-with-no-open-pr',
      ...context.repo
    });
  });
});
