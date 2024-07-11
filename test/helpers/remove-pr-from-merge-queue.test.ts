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

import { FIRST_QUEUED_PR_LABEL, QUEUED_FOR_MERGE_PREFIX, READY_FOR_MERGE_PR_LABEL } from '../../src/constants';
import { Mocktokit } from '../types';
import { context } from '@actions/github';
import { octokit } from '../../src/octokit';
import { removeLabelIfExists } from '../../src/helpers/remove-label';
import { removePrFromMergeQueue } from '../../src/helpers/remove-pr-from-merge-queue';

jest.mock('../../src/helpers/remove-label');
jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: {
        list: jest.fn()
      },
      repos: {
        listCommitStatusesForRef: jest.fn()
      }
    }
  }))
}));
jest.spyOn(Date, 'now').mockImplementation(() => new Date('2022-01-01T10:00:00Z').getTime());

(octokit.pulls.list as unknown as Mocktokit).mockImplementation(async () => ({
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

  describe('should remove pr case', () => {
    beforeEach(() => {
      (octokit.repos.listCommitStatusesForRef as unknown as Mocktokit).mockImplementation(async () => ({
        data: [
          {
            updated_at: '2022-01-01T08:59:00Z',
            state: 'failure'
          },
          {
            updated_at: '2022-01-01T08:00:00Z',
            state: 'success'
          }
        ]
      }));
      removePrFromMergeQueue({ seconds });
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
      expect(removeLabelIfExists).toHaveBeenCalledWith(READY_FOR_MERGE_PR_LABEL, 12345);
      expect(removeLabelIfExists).toHaveBeenCalledWith(FIRST_QUEUED_PR_LABEL, 12345);
    });
  });

  describe('should not remove pr case', () => {
    beforeEach(() => {
      (octokit.repos.listCommitStatusesForRef as unknown as Mocktokit).mockImplementation(async () => ({
        data: [
          {
            updated_at: '2022-01-01T09:01:00Z',
            state: 'failure'
          },
          {
            updated_at: '2022-01-01T10:00:00Z',
            state: 'success'
          }
        ]
      }));
      removePrFromMergeQueue({ seconds });
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
      expect(removeLabelIfExists).not.toHaveBeenCalled();
    });
  });

  describe('should not remove pr case with pending status', () => {
    beforeEach(async () => {
      (octokit.repos.listCommitStatusesForRef as unknown as Mocktokit).mockImplementation(async () => ({
        data: [
          {
            updated_at: '2022-01-01T10:00:00Z',
            state: 'failure'
          },
          {
            updated_at: '2022-01-01T09:01:00Z',
            state: 'pending'
          },
          {
            updated_at: '2022-01-01T10:00:00Z',
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
      expect(removeLabelIfExists).not.toHaveBeenCalled();
    });
  });

  describe('should remove stray PRs in the queue', () => {
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async () => ({
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
      expect(removeLabelIfExists).toHaveBeenCalledWith(READY_FOR_MERGE_PR_LABEL, 12345);
      expect(removeLabelIfExists).toHaveBeenCalledWith(`${QUEUED_FOR_MERGE_PREFIX} #2`, 12345);
      expect(removeLabelIfExists).toHaveBeenCalledWith(READY_FOR_MERGE_PR_LABEL, 678);
      expect(removeLabelIfExists).toHaveBeenCalledWith(`${QUEUED_FOR_MERGE_PREFIX} #3`, 678);
      expect(removeLabelIfExists).toHaveBeenCalledWith(READY_FOR_MERGE_PR_LABEL, 999);
    });
  });
});
