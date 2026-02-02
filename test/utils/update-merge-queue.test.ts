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

import { describe, it, expect, beforeEach, mock, Mock } from 'bun:test';
import { setupMocks } from '../setup';
import { PullRequestList } from '../../src/types/github';

setupMocks();

const { JUMP_THE_QUEUE_PR_LABEL, MERGE_QUEUE_STATUS, READY_FOR_MERGE_PR_LABEL } = await import('../../src/constants');
const { octokit } = await import('../../src/octokit');
const { updateMergeQueue } = await import('../../src/utils/update-merge-queue');
const { context } = await import('@actions/github');

(octokit.pulls.get as unknown as Mock<any>).mockImplementation(async ({ pull_number }: { pull_number: number }) => ({
  data: {
    head: { sha: `sha${pull_number}` }
  }
}));

describe('updateMergeQueue', () => {
  beforeEach(() => {
    mock.clearAllMocks();
  });

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
      // removeLabelIfExists is now a real function call
      // Verify the underlying octokit calls happened instead
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: 'QUEUED FOR MERGE #2',
        issue_number: 123,
        ...context.repo
      });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: 'QUEUED FOR MERGE #3',
        issue_number: 456,
        ...context.repo
      });
    });

    it('should call updatePrWithDefaultBranch with correct params', () => {
      // updatePrWithDefaultBranch is now a real function call
      // Verify the underlying octokit call happened instead
      expect(octokit.repos.merge).toHaveBeenCalled();
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
      // removeLabelIfExists is now a real function call
      expect(octokit.issues.removeLabel).not.toHaveBeenCalledWith({
        name: 'QUEUED FOR MERGE #1',
        issue_number: 123,
        ...context.repo
      });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: 'QUEUED FOR MERGE #3',
        issue_number: 456,
        ...context.repo
      });
    });

    it('should not update pr with default branch', () => {
      // updatePrWithDefaultBranch is now a real function call
      expect(octokit.repos.merge).not.toHaveBeenCalled();
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
      (octokit.pulls.get as unknown as Mock<any>)
        .mockImplementationOnce(async (input: any) => ({
          data: {
            head: { sha: input.pull_number === 123 ? 'sha123' : 'sha456' }
          }
        }))
        .mockImplementationOnce(async (input: any) => ({
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
      // removeLabelIfExists is now a real function call
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: 'QUEUED FOR MERGE #2',
        issue_number: 123,
        ...context.repo
      });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: 'QUEUED FOR MERGE #3',
        issue_number: 456,
        ...context.repo
      });
    });

    it('should set commit status on updated sha of first PR in queue', () => {
      // setCommitStatus is now a real function call
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        sha: 'updatedSha123',
        context: MERGE_QUEUE_STATUS,
        state: 'success',
        description: 'This PR is next to merge.',
        ...context.repo
      });
      expect(octokit.repos.createCommitStatus).not.toHaveBeenCalledWith({
        sha: 'sha123',
        context: MERGE_QUEUE_STATUS,
        state: 'pending',
        description: 'This PR is in line to merge.',
        ...context.repo
      });
    });

    it('should update pr with default branch', () => {
      // updatePrWithDefaultBranch is now a real function call
      expect(octokit.repos.merge).toHaveBeenCalled();
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
      // removeLabelIfExists is now a real function call
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: JUMP_THE_QUEUE_PR_LABEL,
        issue_number: 123,
        ...context.repo
      });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: 'QUEUED FOR MERGE #5',
        issue_number: 123,
        ...context.repo
      });
      expect(octokit.issues.removeLabel).not.toHaveBeenCalledWith({
        name: JUMP_THE_QUEUE_PR_LABEL,
        issue_number: 456,
        ...context.repo
      });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: 'QUEUED FOR MERGE #1',
        issue_number: 456,
        ...context.repo
      });
    });

    it('should set the correct commit statuses', () => {
      // setCommitStatus is now a real function call
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        sha: 'sha123',
        context: MERGE_QUEUE_STATUS,
        state: 'success',
        description: 'This PR is next to merge.',
        ...context.repo
      });
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        sha: 'sha456',
        context: MERGE_QUEUE_STATUS,
        state: 'pending',
        description: 'This PR is in line to merge.',
        ...context.repo
      });
    });

    it('should call updatePrWithDefaultBranch', () => {
      // updatePrWithDefaultBranch is now a real function call
      expect(octokit.repos.merge).toHaveBeenCalled();
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
      // removeLabelIfExists is now a real function call
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: JUMP_THE_QUEUE_PR_LABEL,
        issue_number: 456,
        ...context.repo
      });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: JUMP_THE_QUEUE_PR_LABEL,
        issue_number: 789,
        ...context.repo
      });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: 'QUEUED FOR MERGE #1',
        issue_number: 123,
        ...context.repo
      });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: 'QUEUED FOR MERGE #3',
        issue_number: 456,
        ...context.repo
      });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: 'QUEUED FOR MERGE #2',
        issue_number: 789,
        ...context.repo
      });
    });

    it('should set the correct commit statuses', () => {
      // setCommitStatus is now a real function call
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        sha: 'sha789',
        context: MERGE_QUEUE_STATUS,
        state: 'success',
        description: 'This PR is next to merge.',
        ...context.repo
      });
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        sha: 'sha456',
        context: MERGE_QUEUE_STATUS,
        state: 'pending',
        description: 'This PR is in line to merge.',
        ...context.repo
      });
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        sha: 'sha123',
        context: MERGE_QUEUE_STATUS,
        state: 'pending',
        description: 'This PR is in line to merge.',
        ...context.repo
      });
    });

    it('should call updatePrWithDefaultBranch', () => {
      // updatePrWithDefaultBranch is now a real function call
      expect(octokit.repos.merge).toHaveBeenCalled();
    });
  });
});
