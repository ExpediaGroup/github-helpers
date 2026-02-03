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

import { describe, it, expect, beforeEach, Mock } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

const { octokit } = await import('../../src/octokit');
const { rerunPrChecks } = await import('../../src/helpers/rerun-pr-checks');
const { context } = await import('@actions/github');

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
(octokit.actions.listWorkflowRunsForRepo as unknown as Mock<any>).mockImplementation(async ({ event }: { event: string }) =>
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
(octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({ data: pullsMockData }));

describe('rerunPrChecks', () => {
  beforeEach(async () => {
    await rerunPrChecks();
  });

  it('should rerun all the latest workflow runs', () => {
    expect(octokit.pulls.get).toHaveBeenCalledWith({
      pull_number: 123,
      ...context.repo
    });

    expect(octokit.actions.listWorkflowRunsForRepo).toHaveBeenCalledWith({
      branch,
      repo: context.repo.repo,
      owner,
      event: 'pull_request',
      per_page: 100,
      status: 'completed'
    });
    expect(octokit.actions.listWorkflowRunsForRepo).toHaveBeenCalledWith({
      branch,
      repo: context.repo.repo,
      owner,
      event: 'pull_request_target',
      per_page: 100,
      status: 'completed'
    });

    expect(octokit.actions.reRunWorkflow).toHaveBeenCalledWith({ run_id: 1001, ...context.repo });
    expect(octokit.actions.reRunWorkflow).toHaveBeenCalledWith({ run_id: 1002, ...context.repo });
    expect(octokit.actions.reRunWorkflow).not.toHaveBeenCalledWith({ run_id: 1003, ...context.repo });
    expect(octokit.actions.reRunWorkflow).toHaveBeenCalledWith({ run_id: 1004, ...context.repo });
    expect(octokit.actions.reRunWorkflow).toHaveBeenCalledWith({ run_id: 1005, ...context.repo });
    expect(octokit.actions.reRunWorkflow).not.toHaveBeenCalledWith({ run_id: 1006, ...context.repo });
  });
});
