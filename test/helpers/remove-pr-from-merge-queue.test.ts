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

import { beforeEach, describe, expect, it, mock, spyOn, Mock } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

spyOn(Date, 'now').mockImplementation(() => new Date('2022-01-01T10:00:00Z').getTime());

const { FIRST_QUEUED_PR_LABEL, QUEUED_FOR_MERGE_PREFIX, READY_FOR_MERGE_PR_LABEL } = await import('../../src/constants');
const { octokit } = await import('../../src/octokit');
const { removePrFromMergeQueue } = await import('../../src/helpers/remove-pr-from-merge-queue');
const { context } = await import('@actions/github');


(octokit.pulls.list as unknown as Mock<any>).mockImplementation(async () => ({
  data: [
    {
      head: { sha: 'wrong sha' },
      number: 456,
      labels: [{ name: 'test label' }]
    },
    {
      number: 12345,
      head: { sha: 'correct sha' },
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: FIRST_QUEUED_PR_LABEL }]
    }
  ]
}));

describe('removePrFromMergeQueue', () => {
  const seconds = '3600';

  beforeEach(() => {
    mock.clearAllMocks();
  });

  describe('should remove pr case', () => {
    beforeEach(async () => {
      (octokit.repos.listCommitStatusesForRef as unknown as Mock<any>).mockImplementation(async () => ({
        data: [
          {
            created_at: '2022-01-01T08:59:00Z',
            state: 'success'
          },
          {
            created_at: '2022-01-01T08:00:00Z',
            state: 'success'
          }
        ]
      }));
      await removePrFromMergeQueue({ seconds });
    });

    it('should call pulls.list with correct params', () => {
      expect(octokit.pulls.list).toHaveBeenCalledWith({
        state: 'open',
        per_page: 100,
        ...context.repo
      });
    });

    it('should call listCommitStatusesForRef with correct params', () => {
      expect(octokit.repos.listCommitStatusesForRef).toHaveBeenCalledWith({
        ref: 'correct sha',
        ...context.repo
      });
    });

    it('should call removeLabelIfExists', () => {
      // removeLabelIfExists is now a real function call
      // Verify the underlying octokit calls happened instead
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: READY_FOR_MERGE_PR_LABEL,
        issue_number: 12345,
        ...context.repo
      });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: FIRST_QUEUED_PR_LABEL,
        issue_number: 12345,
        ...context.repo
      });
    });
  });

  describe('should not remove pr case if latest status is not stale', () => {
    beforeEach(async () => {
      (octokit.repos.listCommitStatusesForRef as unknown as Mock<any>).mockImplementation(async () => ({
        data: [
          {
            created_at: '2022-01-01T09:01:00Z',
            state: 'failure'
          },
          {
            created_at: '2022-01-01T09:00:00Z',
            state: 'success'
          }
        ]
      }));
      await removePrFromMergeQueue({ seconds });
    });

    it('should call pulls.list with correct params', () => {
      expect(octokit.pulls.list).toHaveBeenCalledWith({
        state: 'open',
        per_page: 100,
        ...context.repo
      });
    });

    it('should call listCommitStatusesForRef with correct params', () => {
      expect(octokit.repos.listCommitStatusesForRef).toHaveBeenCalledWith({
        ref: 'correct sha',
        ...context.repo
      });
    });

    it('should not call removeLabelIfExists', () => {
      expect(octokit.issues.removeLabel).not.toHaveBeenCalled();
    });
  });

  describe('should not remove pr when latest status for a context is pending, even if it is stale', () => {
    beforeEach(async () => {
      (octokit.repos.listCommitStatusesForRef as unknown as Mock<any>).mockImplementation(async () => ({
        data: [
          {
            created_at: '2022-01-01T08:00:00Z',
            context: 'Unit Tests',
            state: 'success'
          },
          {
            created_at: '2022-01-01T08:01:00Z',
            context: 'Pipeline Status',
            state: 'pending'
          },
          {
            created_at: '2022-01-01T08:00:00Z',
            context: 'Smoke Tests',
            state: 'success'
          }
        ]
      }));
      await removePrFromMergeQueue({ seconds });
    });

    it('should call pulls.list with correct params', () => {
      expect(octokit.pulls.list).toHaveBeenCalledWith({
        state: 'open',
        per_page: 100,
        ...context.repo
      });
    });

    it('should call listCommitStatusesForRef with correct params', () => {
      expect(octokit.repos.listCommitStatusesForRef).toHaveBeenCalledWith({
        ref: 'correct sha',
        ...context.repo
      });
    });

    it('should not call removeLabelIfExists', () => {
      expect(octokit.issues.removeLabel).not.toHaveBeenCalled();
    });
  });

  describe('should remove stray PRs in the queue', () => {
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async () => ({
        data: [
          {
            head: { sha: 'wrong sha' },
            number: 456,
            labels: [{ name: 'test label' }]
          },
          {
            number: 12345,
            head: { sha: 'correct sha' },
            labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: `${QUEUED_FOR_MERGE_PREFIX} #2` }]
          },
          {
            number: 678,
            head: { sha: 'correct sha' },
            labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: `${QUEUED_FOR_MERGE_PREFIX} #3` }]
          },
          {
            number: 999,
            head: { sha: 'correct sha' },
            labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
          }
        ]
      }));
      await removePrFromMergeQueue({ seconds });
    });

    it('should call pulls.list with correct params', () => {
      expect(octokit.pulls.list).toHaveBeenCalledWith({
        state: 'open',
        per_page: 100,
        ...context.repo
      });
    });

    it('should call listCommitStatusesForRef with correct params', () => {
      expect(octokit.repos.listCommitStatusesForRef).not.toHaveBeenCalled();
    });

    it('should call removeLabelIfExists', () => {
      // removeLabelIfExists is now a real function call
      // Verify the underlying octokit calls happened instead
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: READY_FOR_MERGE_PR_LABEL,
        issue_number: 12345,
        ...context.repo
      });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: `${QUEUED_FOR_MERGE_PREFIX} #2`,
        issue_number: 12345,
        ...context.repo
      });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: READY_FOR_MERGE_PR_LABEL,
        issue_number: 678,
        ...context.repo
      });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: `${QUEUED_FOR_MERGE_PREFIX} #3`,
        issue_number: 678,
        ...context.repo
      });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        name: READY_FOR_MERGE_PR_LABEL,
        issue_number: 999,
        ...context.repo
      });
    });
  });
});
