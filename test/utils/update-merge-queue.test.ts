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

import { beforeEach, describe, expect, it, mock } from 'bun:test';
import type { Mocktokit } from '../types';

process.env.INPUT_GITHUB_TOKEN = 'mock-token';

const mockOctokit = {
  rest: {
    actions: {
      listWorkflowRunsForRepo: mock(() => ({})),
      reRunWorkflow: mock(() => ({}))
    },
    checks: {
      listForRef: mock(() => ({})),
      update: mock(() => ({}))
    },
    git: {
      deleteRef: mock(() => ({})),
      getCommit: mock(() => ({}))
    },
    issues: {
      addAssignees: mock(() => ({})),
      addLabels: mock(() => ({})),
      createComment: mock(() => ({})),
      get: mock(() => ({})),
      listComments: mock(() => ({})),
      listForRepo: mock(() => ({})),
      removeLabel: mock(() => ({})),
      update: mock(() => ({})),
      updateComment: mock(() => ({}))
    },
    pulls: {
      create: mock(() => ({})),
      createReview: mock(() => ({})),
      get: mock(() => ({})),
      list: mock(() => ({})),
      listFiles: mock(() => ({})),
      listReviews: mock(() => ({})),
      merge: mock(() => ({})),
      update: mock(() => ({}))
    },
    repos: {
      compareCommitsWithBasehead: mock(() => ({})),
      createCommitStatus: mock(() => ({})),
      createDeployment: mock(() => ({})),
      createDeploymentStatus: mock(() => ({})),
      deleteAnEnvironment: mock(() => ({})),
      deleteDeployment: mock(() => ({})),
      get: mock(() => ({})),
      getCombinedStatusForRef: mock(() => ({})),
      listBranches: mock(() => ({})),
      listBranchesForHeadCommit: mock(() => ({})),
      listCommitStatusesForRef: mock(() => ({})),
      listDeploymentStatuses: mock(() => ({})),
      listDeployments: mock(() => ({})),
      listPullRequestsAssociatedWithCommit: mock(() => ({})),
      merge: mock(() => ({})),
      mergeUpstream: mock(() => ({}))
    },
    teams: {
      listMembersInOrg: mock(() => ({}))
    },
    users: {
      getByUsername: mock(() => ({}))
    }
  },
  graphql: mock(() => ({}))
};

mock.module('@actions/core', () => ({
  getInput: () => 'mock-token',
  setOutput: () => {},
  setFailed: () => {},
  info: () => {},
  warning: () => {},
  error: () => {}
}));

mock.module('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: mock(() => mockOctokit)
}));

mock.module('../../src/octokit', () => ({
  octokit: mockOctokit.rest,
  octokitGraphql: mockOctokit.graphql
}));

const { JUMP_THE_QUEUE_PR_LABEL, MERGE_QUEUE_STATUS, READY_FOR_MERGE_PR_LABEL } = await import('../../src/constants');
const { PullRequestList } = await import('../../src/types/github');
const { octokit } = await import('../../src/octokit');
const { removeLabelIfExists } = await import('../../src/helpers/remove-label');
const { updateMergeQueue } = await import('../../src/utils/update-merge-queue');
const { updatePrWithDefaultBranch } = await import('../../src/helpers/prepare-queued-pr-for-merge');
const { setCommitStatus } = await import('../../src/helpers/set-commit-status');
const { context } = await import('@actions/github');

(octokit.pulls.get as unknown as Mocktokit).mockImplementation(async input => ({
  data: {
    head: { sha: `sha${input.pull_number}` }
  }
}));

describe('updateMergeQueue', () => {
  describe('pr merge case', () => {
    const queuedPrs = [
      {
        head: { sha: 'sha123' },
        number: 123,
        labels: [{ name: 'QUEUED FOR MERGE #2' }]
      },
      {
        head: { sha: 'sha456' },
        number: 456,
        labels: [{ name: 'QUEUED FOR MERGE #3' }]
      }
    ];
    beforeEach(async () => {
      await updateMergeQueue(queuedPrs as PullRequestList);
    });

    it('should call add labels with correct params', () => {
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #1'],
        issue_number: 123,
        ...context.repo
      });
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #2'],
        issue_number: 456,
        ...context.repo
      });
    });

    it('should call remove label with correct params', () => {
      expect(removeLabelIfExists).toHaveBeenCalledWith('QUEUED FOR MERGE #2', 123);
      expect(removeLabelIfExists).toHaveBeenCalledWith('QUEUED FOR MERGE #3', 456);
    });

    it('should call updatePrWithDefaultBranch with correct params', () => {
      expect(updatePrWithDefaultBranch).toHaveBeenCalledWith({ head: { sha: 'sha123' } });
    });
  });

  describe('middle pr taken out of queue case', () => {
    const queuedPrs = [
      {
        head: { sha: 'sha123' },
        number: 123,
        labels: [{ name: 'QUEUED FOR MERGE #1' }]
      },
      {
        head: { sha: 'sha456' },
        number: 456,
        labels: [{ name: 'QUEUED FOR MERGE #3' }]
      }
    ];
    beforeEach(async () => {
      await updateMergeQueue(queuedPrs as PullRequestList);
    });

    it('should call add labels with correct params', () => {
      expect(octokit.issues.addLabels).not.toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #0'],
        issue_number: 123,
        ...context.repo
      });
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #2'],
        issue_number: 456,
        ...context.repo
      });
    });

    it('should call remove label with correct params', () => {
      expect(removeLabelIfExists).not.toHaveBeenCalledWith('QUEUED FOR MERGE #1', 123);
      expect(removeLabelIfExists).toHaveBeenCalledWith('QUEUED FOR MERGE #3', 456);
    });

    it('should not update pr with default branch', () => {
      expect(updatePrWithDefaultBranch).not.toHaveBeenCalled();
    });
  });

  describe('first pr taken out of queue case', () => {
    const queuedPrs = [
      {
        head: { sha: 'sha123' },
        number: 123,
        labels: [{ name: 'QUEUED FOR MERGE #2' }]
      },
      {
        head: { sha: 'sha456' },
        number: 456,
        labels: [{ name: 'QUEUED FOR MERGE #3' }]
      }
    ];
    beforeEach(async () => {
      (octokit.pulls.get as unknown as Mocktokit)
        .mockImplementationOnce(async input => ({
          data: {
            head: { sha: input.pull_number === 123 ? 'sha123' : 'sha456' }
          }
        }))
        .mockImplementationOnce(async input => ({
          data: {
            head: { sha: input.pull_number === 123 ? 'updatedSha123' : 'updatedSha456' }
          }
        }));
      await updateMergeQueue(queuedPrs as PullRequestList);
    });

    it('should call add labels with correct params', () => {
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #1'],
        issue_number: 123,
        ...context.repo
      });
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #2'],
        issue_number: 456,
        ...context.repo
      });
    });

    it('should call remove label with correct params', () => {
      expect(removeLabelIfExists).toHaveBeenCalledWith('QUEUED FOR MERGE #2', 123);
      expect(removeLabelIfExists).toHaveBeenCalledWith('QUEUED FOR MERGE #3', 456);
    });

    it('should set commit status on updated sha of first PR in queue', () => {
      expect(setCommitStatus).toHaveBeenCalledWith({
        sha: 'updatedSha123',
        context: MERGE_QUEUE_STATUS,
        state: 'success',
        description: 'This PR is next to merge.'
      });
      expect(setCommitStatus).not.toHaveBeenCalledWith({
        sha: 'sha123',
        context: MERGE_QUEUE_STATUS,
        state: 'pending',
        description: 'This PR is in line to merge.'
      });
    });

    it('should update pr with default branch', () => {
      expect(updatePrWithDefaultBranch).toHaveBeenCalled();
    });
  });

  describe('pr jumping the queue case', () => {
    const queuedPrs = [
      {
        head: { sha: 'sha123' },
        number: 123,
        labels: [{ name: JUMP_THE_QUEUE_PR_LABEL }, { name: 'QUEUED FOR MERGE #5' }]
      },
      {
        head: { sha: 'sha456' },
        number: 456,
        labels: [{ name: 'QUEUED FOR MERGE #1' }]
      }
    ];
    beforeEach(async () => {
      await updateMergeQueue(queuedPrs as PullRequestList);
    });

    it('should call add labels with correct params', () => {
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #1'],
        issue_number: 123,
        ...context.repo
      });
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #2'],
        issue_number: 456,
        ...context.repo
      });
    });

    it('should call remove label with correct params', () => {
      expect(removeLabelIfExists).toHaveBeenCalledWith(JUMP_THE_QUEUE_PR_LABEL, 123);
      expect(removeLabelIfExists).toHaveBeenCalledWith('QUEUED FOR MERGE #5', 123);
      expect(removeLabelIfExists).not.toHaveBeenCalledWith(JUMP_THE_QUEUE_PR_LABEL, 456);
      expect(removeLabelIfExists).toHaveBeenCalledWith('QUEUED FOR MERGE #1', 456);
    });

    it('should set the correct commit statuses', () => {
      expect(setCommitStatus).toHaveBeenCalledWith({
        sha: 'sha123',
        context: MERGE_QUEUE_STATUS,
        state: 'success',
        description: 'This PR is next to merge.'
      });
      expect(setCommitStatus).toHaveBeenCalledWith({
        sha: 'sha456',
        context: MERGE_QUEUE_STATUS,
        state: 'pending',
        description: 'This PR is in line to merge.'
      });
    });

    it('should call updatePrWithDefaultBranch', () => {
      expect(updatePrWithDefaultBranch).toHaveBeenCalledWith({ head: { sha: 'sha123' } });
    });
  });

  describe('should jump the queue with the pr most ahead in the queue when multiple prs have jump the queue label', () => {
    const queuedPrs = [
      {
        head: { sha: 'sha123' },
        number: 123,
        labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }]
      },
      {
        head: { sha: 'sha456' },
        number: 456,
        labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: JUMP_THE_QUEUE_PR_LABEL }, { name: 'QUEUED FOR MERGE #3' }]
      },
      {
        head: { sha: 'sha789' },
        number: 789,
        labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: JUMP_THE_QUEUE_PR_LABEL }, { name: 'QUEUED FOR MERGE #2' }]
      }
    ];
    beforeEach(async () => {
      await updateMergeQueue(queuedPrs as PullRequestList);
    });

    it('should call add labels with correct params', () => {
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #1'],
        issue_number: 789,
        ...context.repo
      });
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #2'],
        issue_number: 456,
        ...context.repo
      });
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #3'],
        issue_number: 123,
        ...context.repo
      });
    });

    it('should call remove label with correct params', () => {
      expect(removeLabelIfExists).toHaveBeenCalledWith(JUMP_THE_QUEUE_PR_LABEL, 456);
      expect(removeLabelIfExists).toHaveBeenCalledWith(JUMP_THE_QUEUE_PR_LABEL, 789);
      expect(removeLabelIfExists).toHaveBeenCalledWith('QUEUED FOR MERGE #1', 123);
      expect(removeLabelIfExists).toHaveBeenCalledWith('QUEUED FOR MERGE #3', 456);
      expect(removeLabelIfExists).toHaveBeenCalledWith('QUEUED FOR MERGE #2', 789);
    });

    it('should set the correct commit statuses', () => {
      expect(setCommitStatus).toHaveBeenCalledWith({
        sha: 'sha789',
        context: MERGE_QUEUE_STATUS,
        state: 'success',
        description: 'This PR is next to merge.'
      });
      expect(setCommitStatus).toHaveBeenCalledWith({
        sha: 'sha456',
        context: MERGE_QUEUE_STATUS,
        state: 'pending',
        description: 'This PR is in line to merge.'
      });
      expect(setCommitStatus).toHaveBeenCalledWith({
        sha: 'sha123',
        context: MERGE_QUEUE_STATUS,
        state: 'pending',
        description: 'This PR is in line to merge.'
      });
    });

    it('should call updatePrWithDefaultBranch', () => {
      expect(updatePrWithDefaultBranch).toHaveBeenCalledWith({ head: { sha: 'sha789' } });
    });
  });
});
