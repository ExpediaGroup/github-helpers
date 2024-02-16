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
import { notifyUser } from '../../src/utils/notify-user';
import { octokit, octokitGraphql } from '../../src/octokit';
import { removeLabelIfExists } from '../../src/helpers/remove-label';
import { setCommitStatus } from '../../src/helpers/set-commit-status';
import { updateMergeQueue } from '../../src/utils/update-merge-queue';
import { updatePrWithDefaultBranch } from '../../src/helpers/prepare-queued-pr-for-merge';
import { approvalsSatisfied } from '../../src/helpers/approvals-satisfied';
import { createPrComment } from '../../src/helpers/create-pr-comment';

jest.mock('../../src/helpers/remove-label');
jest.mock('../../src/helpers/set-commit-status');
jest.mock('../../src/utils/notify-user');
jest.mock('../../src/utils/update-merge-queue');
jest.mock('../../src/helpers/approvals-satisfied');
jest.mock('../../src/helpers/create-pr-comment');
jest.mock('../../src/utils/../../src/helpers/prepare-queued-pr-for-merge');
jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: { get: jest.fn(), list: jest.fn() },
      issues: {
        addLabels: jest.fn()
      }
    },
    graphql: jest.fn(() => ({ catch: jest.fn() }))
  }))
}));

describe('manageMergeQueue', () => {
  describe('pr merged case', () => {
    const queuedPrs = [{ labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }, { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
        data: page === 1 ? queuedPrs : []
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: true,
          head: { sha: 'sha' },
          number: 123,
          labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }]
        }
      }));
      await manageMergeQueue();
    });

    it('should call remove label with correct params', () => {
      expect(removeLabelIfExists).toHaveBeenCalledWith(READY_FOR_MERGE_PR_LABEL, 123);
      expect(removeLabelIfExists).toHaveBeenCalledWith('QUEUED FOR MERGE #1', 123);
    });

    it('should call updateMergeQueue with correct params', () => {
      expect(updateMergeQueue).toHaveBeenCalledWith(queuedPrs);
    });
  });

  describe('pr not core approved case', () => {
    const queuedPrs = [{ labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }, { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
        data: page === 1 ? queuedPrs : []
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: false,
          head: { sha: 'sha' },
          number: 123,
          labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }]
        }
      }));
      await manageMergeQueue();
    });

    it('should check for approvals satisfied', () => {
      expect(approvalsSatisfied).toHaveBeenCalledWith();
    });

    it('should add pr comment', () => {
      expect(createPrComment).toHaveBeenCalledWith({ body: 'The PR fails to meet the approval requirements' });
    });
  });

  describe('pr not ready for merge case', () => {
    const queuedPrs = [{ labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }, { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
        data: page === 1 ? queuedPrs : []
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: false,
          head: { sha: 'sha' },
          number: 123,
          labels: [{ name: 'QUEUED FOR MERGE #2' }]
        }
      }));
      await manageMergeQueue();
    });

    it('should call remove label with correct params', () => {
      expect(removeLabelIfExists).toHaveBeenCalledWith(READY_FOR_MERGE_PR_LABEL, 123);
      expect(removeLabelIfExists).toHaveBeenCalledWith('QUEUED FOR MERGE #2', 123);
    });

    it('should set commit status with correct params', () => {
      expect(setCommitStatus).toHaveBeenCalledWith({
        sha: 'sha',
        context: MERGE_QUEUE_STATUS,
        state: 'pending',
        description: 'This PR is not in the merge queue.'
      });
    });

    it('should call updateMergeQueue with correct params', () => {
      expect(updateMergeQueue).toHaveBeenCalledWith(queuedPrs);
    });
  });

  describe('pr ready for merge case queued #2', () => {
    const queuedPrs = [{ labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }, { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
        data: page === 1 ? queuedPrs : []
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

    it('should not update PR with default branch', () => {
      expect(updatePrWithDefaultBranch).not.toHaveBeenCalled();
    });

    it('should enable auto-merge', () => {
      expect(octokitGraphql).toHaveBeenCalled();
    });
  });

  describe('pr ready for merge case queued #1', () => {
    const queuedPrs = [{ labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }];
    const pullRequest = {
      merged: false,
      head: { sha: 'sha' },
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
    };
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
        data: page === 1 ? queuedPrs : []
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: pullRequest
      }));
      await manageMergeQueue();
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

    it('should update PR with default branch', () => {
      expect(updatePrWithDefaultBranch).toHaveBeenCalledWith(pullRequest);
    });

    it('should enable auto-merge', () => {
      expect(octokitGraphql).toHaveBeenCalled();
    });
  });

  describe('pr ready for merge case where repo has disabled auto merge', () => {
    const queuedPrs = [{ labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
        data: page === 1 ? queuedPrs : []
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: false,
          head: { sha: 'sha' },
          labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
        }
      }));
      (octokitGraphql as unknown as jest.Mock).mockRejectedValue(new Error('Auto merge is not allowed for this repo'));
      await manageMergeQueue();
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

    it('should attempt to enable auto-merge', () => {
      expect(octokitGraphql).toHaveBeenCalled();
    });
  });

  describe('pr already in the queue case', () => {
    const queuedPrs = [
      { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] },
      { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] },
      { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] },
      { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] },
      { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }
    ];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
        data: page === 1 ? queuedPrs : []
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

    it('should do nothing', () => {
      expect(octokit.issues.addLabels).not.toHaveBeenCalled();
      expect(octokitGraphql).not.toHaveBeenCalled();
      expect(updateMergeQueue).not.toHaveBeenCalled();
    });
  });

  describe('jump the queue case', () => {
    const queuedPrs = [
      { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] },
      { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] },
      { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] },
      { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] },
      { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }
    ];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
        data: page === 1 ? queuedPrs : []
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

    it('should call updateMergeQueue with correct params', () => {
      expect(updateMergeQueue).toHaveBeenCalledWith(queuedPrs);
    });
  });

  describe('slack reminder integration', () => {
    const login = 'test';
    const slack_webhook_url = 'https://hooks.slack.com/workflows/1234567890';
    const queuedPrs = [{ labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }];

    it('should notify user if queue position 1', async () => {
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
        data: page === 1 ? queuedPrs : []
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: false,
          head: { sha: 'sha' },
          labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
        }
      }));

      await manageMergeQueue({ login, slack_webhook_url });

      expect(notifyUser).toHaveBeenCalled();
    });

    it('should not notify user if queue position greater than 2', async () => {
      const queuedPrs = [
        { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] },
        { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] },
        { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] },
        { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] },
        { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }
      ];
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
        data: page === 1 ? queuedPrs : []
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: false,
          head: { sha: 'sha' },
          labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #5' }]
        }
      }));
      await manageMergeQueue({ login, slack_webhook_url });

      expect(notifyUser).not.toHaveBeenCalled();
    });

    it('should not notify user if slack_webhook_url not provided', async () => {
      const queuedPrs = [{ labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }];
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
        data: page === 1 ? queuedPrs : []
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: false,
          head: { sha: 'sha' },
          labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
        }
      }));

      await manageMergeQueue({ login });

      expect(notifyUser).not.toHaveBeenCalled();
    });

    it('should not notify user if login not provided', async () => {
      const queuedPrs = [{ labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }];
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
        data: page === 1 ? queuedPrs : []
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: false,
          head: { sha: 'sha' },
          labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
        }
      }));

      await manageMergeQueue({ slack_webhook_url });

      expect(notifyUser).not.toHaveBeenCalled();
    });
  });

  describe('multiple pages of prs', () => {
    const queuedPrsPage1 = [{ labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }, { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }];
    const queuedPrsPage2 = [{ labels: [] }, { labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }];
    const queuedPrs = queuedPrsPage1.concat(queuedPrsPage2).filter(pr => pr.labels.some(label => label.name === READY_FOR_MERGE_PR_LABEL));
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async ({ page }) => ({
        data: page === 1 ? queuedPrsPage1 : page === 2 ? queuedPrsPage2 : []
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: true,
          head: { sha: 'sha' },
          number: 123,
          labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }]
        }
      }));
      await manageMergeQueue();
    });

    it('should call pulls.list for multiple pages', () => {
      expect(octokit.pulls.list).toHaveBeenCalledWith({
        state: 'open',
        sort: 'updated',
        direction: 'desc',
        per_page: 100,
        page: 1,
        ...context.repo
      });
      expect(octokit.pulls.list).toHaveBeenCalledWith({
        state: 'open',
        sort: 'updated',
        direction: 'desc',
        per_page: 100,
        page: 2,
        ...context.repo
      });
      expect(octokit.pulls.list).toHaveBeenCalledWith({
        state: 'open',
        sort: 'updated',
        direction: 'desc',
        per_page: 100,
        page: 3,
        ...context.repo
      });
    });

    it('should call remove label with correct params', () => {
      expect(removeLabelIfExists).toHaveBeenCalledWith(READY_FOR_MERGE_PR_LABEL, 123);
      expect(removeLabelIfExists).toHaveBeenCalledWith('QUEUED FOR MERGE #1', 123);
    });

    it('should call updateMergeQueue with correct params', () => {
      expect(updateMergeQueue).toHaveBeenCalledWith(queuedPrs);
    });
  });
});
