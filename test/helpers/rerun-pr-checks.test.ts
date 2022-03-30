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

import * as core from '@actions/core';
import { Mocktokit } from '../types';
import { context } from '@actions/github';
import { octokit } from '../../src/octokit';
import { request } from '@octokit/request';
import { rerunPrChecks } from '../../src/helpers/rerun-pr-checks';

jest.mock('@actions/core');
jest.mock('@octokit/request');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({ rest: { pulls: { get: jest.fn() }, actions: { listWorkflowRunsForRepo: jest.fn() }, request: jest.fn() } }))
}));
const gh_token = 'gh token';
(core.getInput as jest.Mock).mockReturnValue(gh_token);
const prWorkflowRuns = {
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
      name: 'danger',
      head_sha: 'efc459'
    }
  ]
};
const prTargetWorkflowRuns = {
  total_count: 5,
  workflow_runs: [
    {
      id: 1004,
      name: 'danger',
      head_sha: 'aef123'
    },
    {
      id: 1005,
      name: 'build',
      head_sha: 'aef123'
    },
    {
      id: 1006,
      name: 'danger',
      head_sha: 'efc459'
    }
  ]
};
(octokit.actions.listWorkflowRunsForRepo as unknown as Mocktokit).mockImplementation(async ({ event }) =>
  event === 'pull_request' ? { data: prWorkflowRuns } : { data: prTargetWorkflowRuns }
);
const branch = 'branch';
const owner = 'owner';
const latestHash = 'aef123';
const pullsMockData = {
  head: {
    user: {
      login: owner
    },
    sha: latestHash,
    ref: branch
  }
};
(octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({ data: pullsMockData }));
(request as unknown as jest.Mock).mockResolvedValue({ catch: jest.fn() });
const baseUrl = 'https://github.company.co/api/v3';

describe('rerunPrChecks', () => {
  beforeEach(async () => {
    await rerunPrChecks({ baseUrl });
  });

  it('should rerun all the latest workflow runs', () => {
    expect(request.defaults).toHaveBeenCalledWith({
      baseUrl,
      headers: {
        authorization: `token ${core.getInput('github_token')}`
      }
    });

    expect(octokit.pulls.get).toHaveBeenCalledWith({
      pull_number: 123,
      ...context.repo
    });

    expect(octokit.actions.listWorkflowRunsForRepo).toHaveBeenCalledWith({
      branch,
      repo: context.repo.repo,
      owner,
      event: 'pull_request',
      per_page: 100
    });
    expect(octokit.actions.listWorkflowRunsForRepo).toHaveBeenCalledWith({
      branch,
      repo: context.repo.repo,
      owner,
      event: 'pull_request_target',
      per_page: 100
    });

    expect(request).toHaveBeenCalledWith('POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun', {
      owner,
      repo: context.repo.repo,
      run_id: 1001
    });
    expect(request).toHaveBeenCalledWith('POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun', {
      owner,
      repo: context.repo.repo,
      run_id: 1002
    });
    expect(request).not.toHaveBeenCalledWith('POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun', {
      owner,
      repo: context.repo.repo,
      run_id: 1003
    });
    expect(request).toHaveBeenCalledWith('POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun', {
      owner,
      repo: context.repo.repo,
      run_id: 1004
    });
    expect(request).toHaveBeenCalledWith('POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun', {
      owner,
      repo: context.repo.repo,
      run_id: 1005
    });
    expect(request).not.toHaveBeenCalledWith('POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun', {
      owner,
      repo: context.repo.repo,
      run_id: 1006
    });
  });
});
