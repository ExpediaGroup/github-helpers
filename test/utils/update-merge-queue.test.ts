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

import { JUMP_THE_QUEUE_PR_LABEL, MERGE_QUEUE_STATUS } from '../../src/constants';
import { Mocktokit } from '../types';
import { PullRequestList } from '../../src/types/github';
import { context } from '@actions/github';
import { octokit } from '../../src/octokit';
import { removeLabelIfExists } from '../../src/helpers/remove-label';
import { updateMergeQueue } from '../../src/utils/update-merge-queue';
import { updatePrWithDefaultBranch } from '../../src/helpers/prepare-queued-pr-for-merge';
import { setCommitStatus } from '../../src/helpers/set-commit-status';

jest.mock('../../src/helpers/remove-label');
jest.mock('../../src/helpers/prepare-queued-pr-for-merge');
jest.mock('../../src/helpers/set-commit-status');
jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: { get: jest.fn() },
      issues: {
        addLabels: jest.fn(),
        listLabelsOnIssue: jest.fn()
      },
      search: { issuesAndPullRequests: jest.fn() }
    }
  }))
}));
(octokit.pulls.get as unknown as Mocktokit).mockImplementation(async input => ({
  data: {
    head: { sha: input.pull_number === 123 ? 'sha123' : 'sha456' }
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

    it('should set commit status on first PR in queue', () => {
      expect(setCommitStatus).toHaveBeenCalledWith({
        sha: 'sha123',
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
});
