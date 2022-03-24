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
import { octokit } from '../../src/octokit';
import { rerunPrChecks } from '../../src/helpers/rerun-pr-checks';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { ref: 'refs/heads/branch', repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({ rest: { pulls: { get: jest.fn() }, actions: { listWorkflowRunsForRepo: jest.fn() }, request: jest.fn() } }))
}));
const workflowRunsMockData = {
  total_count: 5,
  workflow_runs: [
    {
      id: 1001,
      name: 'danger',
      head_sha: 'aef123'
    },
    {
      id: 1002,
      name: 'build',
      head_sha: 'aef123'
    },
    {
      id: 1003,
      name: 'unit-tests',
      head_sha: 'aef123'
    },
    {
      id: 1004,
      name: 'danger',
      head_sha: 'efc459'
    },
    {
      id: 1005,
      name: 'build',
      head_sha: 'efc459'
    }
  ]
};
(octokit.actions.listWorkflowRunsForRepo as unknown as Mocktokit).mockImplementation(async () => ({ data: workflowRunsMockData }));
(octokit.request as unknown as Mocktokit).mockImplementation(async () => {});

describe('rerunPrChecks', () => {
  it('should rerun all the latest workflow runs', async () => {
    const pullsMockData = {
      head: {
        user: {
          login: 'owner'
        },
        sha: 'aef123'
      },
      base: { branch: 'branch' }
    };
    (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({ data: pullsMockData }));

    await rerunPrChecks();

    expect(octokit.pulls.get).toHaveBeenCalledWith({
      pull_number: 123,
      ...context.repo
    });

    expect(octokit.actions.listWorkflowRunsForRepo).toHaveBeenCalledWith({
      branch: 'branch',
      repo: 'repo',
      owner: 'owner',
      event: 'pull_request',
      per_page: 100
    });

    expect(octokit.request).toHaveBeenCalledTimes(3);
    expect(octokit.request).toHaveBeenNthCalledWith(1, 'POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun', {
      owner: 'owner',
      repo: context.repo.repo,
      run_id: 1001
    });
    expect(octokit.request).toHaveBeenNthCalledWith(2, 'POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun', {
      owner: 'owner',
      repo: context.repo.repo,
      run_id: 1002
    });
    expect(octokit.request).toHaveBeenNthCalledWith(3, 'POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun', {
      owner: 'owner',
      repo: context.repo.repo,
      run_id: 1003
    });
  });

  it('should rerun all the latest workflow runs on a fork PR', async () => {
    const pullsMockData = {
      head: {
        user: {
          login: 'forkuser'
        },
        sha: 'aef123'
      },
      base: { branch: 'branch' }
    };
    (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({ data: pullsMockData }));

    await rerunPrChecks();

    expect(octokit.actions.listWorkflowRunsForRepo).toHaveBeenCalledWith({
      branch: 'branch',
      repo: 'repo',
      owner: 'forkuser',
      event: 'pull_request',
      per_page: 100
    });
  });
});
