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

import { JUMP_THE_QUEUE_PR_LABEL, MERGE_QUEUE_STATUS, READY_FOR_MERGE_PR_LABEL } from '../../src/constants';
import { Mocktokit } from '../types';
import { context } from '@actions/github';
import { manageMergeQueue } from '../../src/helpers/manage-merge-queue';
import { octokit } from '../../src/octokit';
import { removeLabelIfExists } from '../../src/helpers/remove-label';
import { setCommitStatus } from '../../src/helpers/set-commit-status';
import { updateMergeQueue } from '../../src/utils/update-merge-queue';

jest.mock('../../src/helpers/remove-label');
jest.mock('../../src/helpers/set-commit-status');
jest.mock('../../src/utils/update-merge-queue');
jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: { get: jest.fn() },
      issues: {
        addLabels: jest.fn()
      },
      search: { issuesAndPullRequests: jest.fn() }
    }
  }))
}));
const items = ['some', 'items'];

describe('manageMergeQueue', () => {
  describe('pr merged case', () => {
    beforeEach(async () => {
      (octokit.search.issuesAndPullRequests as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          total_count: 2,
          items
        }
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: true,
          number: 123,
          labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }]
        }
      }));
      await manageMergeQueue();
    });

    it('should call issuesAndPullRequests search with correct params', () => {
      expect(octokit.search.issuesAndPullRequests).toHaveBeenCalledWith({
        q: `org:owner+repo:repo+is:pr+is:open+label:"${READY_FOR_MERGE_PR_LABEL}"`
      });
    });

    it('should call remove label with correct params', () => {
      expect(removeLabelIfExists).toHaveBeenCalledWith(READY_FOR_MERGE_PR_LABEL, 123);
      expect(removeLabelIfExists).toHaveBeenCalledWith('QUEUED FOR MERGE #1', 123);
    });

    it('should call updateMergeQueue with correct params', () => {
      expect(updateMergeQueue).toHaveBeenCalledWith(items);
    });
  });

  describe('pr not ready for merge case', () => {
    beforeEach(async () => {
      (octokit.search.issuesAndPullRequests as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          total_count: 2,
          items
        }
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: false,
          number: 123,
          labels: [{ name: 'QUEUED FOR MERGE #2' }]
        }
      }));
      await manageMergeQueue();
    });

    it('should call issuesAndPullRequests search with correct params', () => {
      expect(octokit.search.issuesAndPullRequests).toHaveBeenCalledWith({
        q: `org:owner+repo:repo+is:pr+is:open+label:"${READY_FOR_MERGE_PR_LABEL}"`
      });
    });

    it('should call remove label with correct params', () => {
      expect(removeLabelIfExists).toHaveBeenCalledWith(READY_FOR_MERGE_PR_LABEL, 123);
      expect(removeLabelIfExists).toHaveBeenCalledWith('QUEUED FOR MERGE #2', 123);
    });

    it('should call updateMergeQueue with correct params', () => {
      expect(updateMergeQueue).toHaveBeenCalledWith(items);
    });
  });

  describe('pr ready for merge case', () => {
    beforeEach(async () => {
      (octokit.search.issuesAndPullRequests as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          total_count: 2,
          items
        }
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: false,
          head: { sha: 'sha' },
          labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
        }
      }));
      await manageMergeQueue();
    });

    it('should call issuesAndPullRequests search with correct params', () => {
      expect(octokit.search.issuesAndPullRequests).toHaveBeenCalledWith({
        q: `org:owner+repo:repo+is:pr+is:open+label:"${READY_FOR_MERGE_PR_LABEL}"`
      });
    });

    it('should call setCommitStatus with correct params', () => {
      expect(setCommitStatus).toHaveBeenCalledWith({
        sha: 'sha',
        context: MERGE_QUEUE_STATUS,
        state: 'pending',
        description: 'This PR is in line to merge.'
      });
    });

    it('should call addLabels with correct params', () => {
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #2'],
        issue_number: 123,
        ...context.repo
      });
    });
  });

  describe('pr ready for merge case queued #1', () => {
    beforeEach(async () => {
      (octokit.search.issuesAndPullRequests as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          total_count: 1,
          items
        }
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: false,
          head: { sha: 'sha' },
          labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
        }
      }));
      await manageMergeQueue();
    });

    it('should call issuesAndPullRequests search with correct params', () => {
      expect(octokit.search.issuesAndPullRequests).toHaveBeenCalledWith({
        q: `org:owner+repo:repo+is:pr+is:open+label:"${READY_FOR_MERGE_PR_LABEL}"`
      });
    });

    it('should call setCommitStatus', () => {
      expect(setCommitStatus).toHaveBeenCalledWith({
        sha: 'sha',
        context: MERGE_QUEUE_STATUS,
        state: 'success',
        description: 'This PR is next to merge.'
      });
    });

    it('should call addLabels with correct params', () => {
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #1'],
        issue_number: 123,
        ...context.repo
      });
    });
  });

  describe('pr already in the queue case', () => {
    beforeEach(async () => {
      (octokit.search.issuesAndPullRequests as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          total_count: 5,
          items
        }
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: false,
          head: { sha: 'sha' },
          labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #5' }]
        }
      }));
      await manageMergeQueue();
    });

    it('should call issuesAndPullRequests search with correct params', () => {
      expect(octokit.search.issuesAndPullRequests).toHaveBeenCalledWith({
        q: `org:owner+repo:repo+is:pr+is:open+label:"${READY_FOR_MERGE_PR_LABEL}"`
      });
    });

    it('should do nothing', () => {
      expect(octokit.issues.addLabels).not.toHaveBeenCalled();
      expect(updateMergeQueue).not.toHaveBeenCalled();
    });
  });

  describe('jump the queue case', () => {
    beforeEach(async () => {
      (octokit.search.issuesAndPullRequests as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          total_count: 5,
          items
        }
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: false,
          head: { sha: 'sha' },
          labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: JUMP_THE_QUEUE_PR_LABEL }, { name: 'QUEUED FOR MERGE #5' }]
        }
      }));
      await manageMergeQueue();
    });

    it('should call issuesAndPullRequests search with correct params', () => {
      expect(octokit.search.issuesAndPullRequests).toHaveBeenCalledWith({
        q: `org:owner+repo:repo+is:pr+is:open+label:"${READY_FOR_MERGE_PR_LABEL}"`
      });
    });

    it('should call updateMergeQueue with correct params', () => {
      expect(updateMergeQueue).toHaveBeenCalledWith(items);
    });
  });
});
