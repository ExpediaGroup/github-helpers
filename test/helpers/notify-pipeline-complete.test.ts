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

import { describe, it, expect, Mock, beforeEach, mock } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

const { DEFAULT_PIPELINE_STATUS, PRODUCTION_ENVIRONMENT } = await import('../../src/constants');
const { notifyPipelineComplete } = await import('../../src/helpers/notify-pipeline-complete');
const { octokit } = await import('../../src/octokit');
const { context } = await import('@actions/github');

(octokit.pulls.list as unknown as Mock<any>).mockImplementation(async () => ({
  data: [{ head: { sha: 'sha 1' } }, { head: { sha: 'sha 2' } }, { head: { sha: 'sha 3' } }]
}));

(octokit.repos.listDeployments as unknown as Mock<any>).mockImplementation(async () => ({
  data: [{ id: 123, environment: 'production' }]
}));

describe('notify-pipeline-complete', () => {
  const description = 'Pipeline clear.';

  beforeEach(() => {
    mock.clearAllMocks()
  });

  it('should notify that the pipeline is clear', async () => {
    await notifyPipelineComplete({});

    expect(octokit.pulls.list).toHaveBeenCalledWith({
      state: 'open',
      per_page: 100,
      ...context.repo
    });

    expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
      sha: 'sha 1',
      context: DEFAULT_PIPELINE_STATUS,
      state: 'success',
      description,
      ...context.repo
    });
    expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
      sha: 'sha 2',
      context: DEFAULT_PIPELINE_STATUS,
      state: 'success',
      description,
      ...context.repo
    });
    expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
      sha: 'sha 3',
      context: DEFAULT_PIPELINE_STATUS,
      state: 'success',
      description,
      ...context.repo
    });
    expect(octokit.repos.createCommitStatus).not.toHaveBeenCalledWith({
      sha: 'normal sha 1',
      context: DEFAULT_PIPELINE_STATUS,
      state: 'success',
      description,
      ...context.repo
    });
    expect(octokit.repos.createCommitStatus).not.toHaveBeenCalledWith({
      sha: 'merge queue sha 1',
      context: DEFAULT_PIPELINE_STATUS,
      state: 'success',
      description,
      ...context.repo
    });
    expect(octokit.repos.createCommitStatus).not.toHaveBeenCalledWith({
      sha: 'merge queue sha 2',
      context: DEFAULT_PIPELINE_STATUS,
      state: 'success',
      description,
      ...context.repo
    });

    expect(octokit.repos.createDeploymentStatus).toHaveBeenCalledWith({
      state: 'success',
      environment: PRODUCTION_ENVIRONMENT,
      deployment_id: 123,
      description,
      ...context.repo
    });
  });

  it('should notify that the pipeline is clear when merge queue is enabled', async () => {
    (octokit.repos.listBranches as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) =>
      page > 1
        ? { data: [] }
        : {
            data: [
              {
                name: 'some-branch',
                commit: { sha: 'normal sha 1' }
              },
              {
                name: 'gh-readonly-queue/default-branch/pr-123-79a5ad2b1a46f6b5d77e02573937667979635f27',
                commit: { sha: 'merge queue sha 1' }
              },
              {
                name: 'gh-readonly-queue/default-branch/pr-456-79a5ad2b1a46f6b5d77e02573937667979635f27',
                commit: { sha: 'merge queue sha 2' }
              }
            ]
          }
    );
    await notifyPipelineComplete({ merge_queue_enabled: 'true' });

    expect(octokit.pulls.list).not.toHaveBeenCalled();

    expect(octokit.repos.createCommitStatus).not.toHaveBeenCalledWith({
      sha: 'normal sha 1',
      context: DEFAULT_PIPELINE_STATUS,
      state: 'success',
      description,
      ...context.repo
    });
    expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
      sha: 'merge queue sha 1',
      context: DEFAULT_PIPELINE_STATUS,
      state: 'success',
      description,
      ...context.repo
    });
    expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
      sha: 'merge queue sha 2',
      context: DEFAULT_PIPELINE_STATUS,
      state: 'success',
      description,
      ...context.repo
    });

    expect(octokit.repos.createDeploymentStatus).toHaveBeenCalledWith({
      state: 'success',
      environment: PRODUCTION_ENVIRONMENT,
      deployment_id: 123,
      description,
      ...context.repo
    });
  });
});
