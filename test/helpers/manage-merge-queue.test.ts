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

import { describe, it, expect, beforeEach, afterEach, Mock, mock, spyOn } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

const { JUMP_THE_QUEUE_PR_LABEL, MERGE_QUEUE_STATUS, READY_FOR_MERGE_PR_LABEL } = await import('../../src/constants');
const { manageMergeQueue } = await import('../../src/helpers/manage-merge-queue');
const { octokit, octokitGraphql } = await import('../../src/octokit');
const updateMergeQueueModule = await import('../../src/utils/update-merge-queue');
const prepareQueuedPrForMergeModule = await import('../../src/helpers/prepare-queued-pr-for-merge');
const approvalsSatisfiedModule = await import('../../src/helpers/approvals-satisfied');
const isUserInTeamModule = await import('../../src/helpers/is-user-in-team');
const notifyUserModule = await import('../../src/utils/notify-user');
const { context } = await import('@actions/github');

describe('manageMergeQueue', () => {
  let isUserInTeamSpy: ReturnType<typeof spyOn>;
  let approvalsSatisfiedSpy: ReturnType<typeof spyOn>;
  let updateMergeQueueSpy: ReturnType<typeof spyOn>;
  let updatePrWithDefaultBranchSpy: ReturnType<typeof spyOn>;
  let notifyUserSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    mock.clearAllMocks();
    isUserInTeamSpy = spyOn(isUserInTeamModule, 'isUserInTeam').mockImplementation(async ({ team }: { team: string }) => {
      return team === 'team';
    });
    approvalsSatisfiedSpy = spyOn(approvalsSatisfiedModule, 'approvalsSatisfied').mockResolvedValue(true);
    updateMergeQueueSpy = spyOn(updateMergeQueueModule, 'updateMergeQueue').mockResolvedValue([] as any);
    updatePrWithDefaultBranchSpy = spyOn(prepareQueuedPrForMergeModule, 'updatePrWithDefaultBranch').mockResolvedValue(undefined);
    notifyUserSpy = spyOn(notifyUserModule, 'notifyUser').mockResolvedValue(undefined);
    (octokit.users.getByUsername as unknown as Mock<any>).mockImplementation(async () => ({
      data: { email: 'user@github.com' }
    }));
  });

  afterEach(() => {
    isUserInTeamSpy.mockRestore();
    approvalsSatisfiedSpy.mockRestore();
    updateMergeQueueSpy.mockRestore();
    updatePrWithDefaultBranchSpy.mockRestore();
    notifyUserSpy.mockRestore();
  });

  describe('pr merged case', () => {
    const prUnderTest = {
      number: 123,
      merged: true,
      head: { sha: 'sha' },
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }]
    };
    const openPr = {
      number: 456,
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #2' }]
    };
    const openPrs = [prUnderTest, openPr];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      await manageMergeQueue();
    });

    it('should call remove label with correct params', () => {
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({ name: READY_FOR_MERGE_PR_LABEL, issue_number: 123, ...context.repo });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({ name: 'QUEUED FOR MERGE #1', issue_number: 123, ...context.repo });
    });

    it('should call updateMergeQueue with correct params', () => {
      expect(updateMergeQueueModule.updateMergeQueue).toHaveBeenCalledWith(openPrs);
    });
  });

  describe('pr not core approved case', () => {
    const prUnderTest = {
      merged: false,
      head: { sha: 'sha' },
      number: 123,
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
    };
    const openPr = {
      number: 456,
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }]
    };
    const openPrs = [prUnderTest, openPr];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      approvalsSatisfiedSpy.mockResolvedValue(false);
      await manageMergeQueue();
    });

    it('should call remove label with correct params', () => {
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({ name: READY_FOR_MERGE_PR_LABEL, issue_number: 123, ...context.repo });
    });

    it('should set commit status with correct params', () => {
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          sha: 'sha',
          context: MERGE_QUEUE_STATUS,
          state: 'pending',
          description: 'This PR is not in the merge queue.'
        })
      );
    });

    it('should call updateMergeQueue with correct params', () => {
      expect(updateMergeQueueModule.updateMergeQueue).toHaveBeenCalledWith([openPr]);
    });
  });

  describe('pr without ready for merge label case', () => {
    const prUnderTest = {
      merged: false,
      head: { sha: 'sha' },
      number: 123,
      labels: [{ name: 'QUEUED FOR MERGE #2' }]
    };
    const openPr = {
      number: 456,
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }]
    };
    const openPrs = [prUnderTest, openPr];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
      await manageMergeQueue();
    });

    it('should call remove label with correct params', () => {
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({ name: READY_FOR_MERGE_PR_LABEL, issue_number: 123, ...context.repo });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({ name: 'QUEUED FOR MERGE #2', issue_number: 123, ...context.repo });
    });

    it('should set commit status with correct params', () => {
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          sha: 'sha',
          context: MERGE_QUEUE_STATUS,
          state: 'pending',
          description: 'This PR is not in the merge queue.'
        })
      );
    });

    it('should call updateMergeQueue with correct params', () => {
      expect(updateMergeQueueModule.updateMergeQueue).toHaveBeenCalledWith([openPr]);
    });
  });

  describe('pr ready for merge with one PR in the queue', () => {
    const prUnderTest = {
      number: 123,
      merged: false,
      head: { sha: 'sha' },
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
    };
    const openPr = {
      number: 456,
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }]
    };
    const openPrs = [openPr];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
      await manageMergeQueue();
    });

    it('should call setCommitStatus with correct params', () => {
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          sha: 'sha',
          context: MERGE_QUEUE_STATUS,
          state: 'pending',
          description: 'This PR is in line to merge.'
        })
      );
    });

    it('should call addLabels with correct params', () => {
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #2'],
        issue_number: 123,
        ...context.repo
      });
    });

    it('should not update PR with default branch', () => {
      expect(prepareQueuedPrForMergeModule.updatePrWithDefaultBranch).not.toHaveBeenCalled();
    });

    it('should enable auto-merge', () => {
      expect(octokitGraphql).toHaveBeenCalled();
    });
  });

  describe('pr ready for merge with a PR that has ready for merge label only', () => {
    const prUnderTest = {
      number: 123,
      merged: false,
      head: { sha: 'sha' },
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
    };
    const openPr1 = {
      number: 456,
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
    };
    const openPr2 = {
      number: 789,
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }]
    };
    const openPrs = [prUnderTest, openPr1, openPr2];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
      await manageMergeQueue();
    });

    it('should call setCommitStatus with correct params', () => {
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          sha: 'sha',
          context: MERGE_QUEUE_STATUS,
          state: 'pending',
          description: 'This PR is in line to merge.'
        })
      );
    });

    it('should call addLabels with correct params', () => {
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #2'],
        issue_number: 123,
        ...context.repo
      });
    });

    it('should not update PR with default branch', () => {
      expect(prepareQueuedPrForMergeModule.updatePrWithDefaultBranch).not.toHaveBeenCalled();
    });

    it('should enable auto-merge', () => {
      expect(octokitGraphql).toHaveBeenCalled();
    });
  });

  describe('pr ready for merge with empty queue', () => {
    const prUnderTest = {
      number: 123,
      merged: false,
      head: { sha: 'sha' },
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
    };
    const openPrs = [prUnderTest, { labels: [{ name: 'some random label' }] }];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
      await manageMergeQueue();
    });

    it('should call setCommitStatus', () => {
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          sha: 'sha',
          context: MERGE_QUEUE_STATUS,
          state: 'success',
          description: 'This PR is next to merge.'
        })
      );
    });

    it('should call addLabels with correct params', () => {
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #1'],
        issue_number: 123,
        ...context.repo
      });
    });

    it('should update PR with default branch', () => {
      expect(prepareQueuedPrForMergeModule.updatePrWithDefaultBranch).toHaveBeenCalledWith(prUnderTest);
    });

    it('should enable auto-merge', () => {
      expect(octokitGraphql).toHaveBeenCalled();
    });
  });

  describe('pr ready for merge case where repo has disabled auto merge', () => {
    const prUnderTest = {
      number: 123,
      merged: false,
      head: { sha: 'sha' },
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
    };
    const openPrs = [prUnderTest];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      (octokitGraphql as unknown as unknown as Mock<any>).mockRejectedValue(new Error('Auto merge is not allowed for this repo'));
      approvalsSatisfiedSpy.mockResolvedValue(true);
      await manageMergeQueue();
    });

    it('should call setCommitStatus', () => {
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          sha: 'sha',
          context: MERGE_QUEUE_STATUS,
          state: 'success',
          description: 'This PR is next to merge.'
        })
      );
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
    const prUnderTest = {
      number: 123,
      merged: false,
      head: { sha: 'sha' },
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #5' }]
    };
    const openPrs = [
      prUnderTest,
      { number: 1, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }] },
      { number: 2, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #2' }] },
      { number: 3, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #3' }] },
      { number: 4, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #4' }] }
    ];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
      await manageMergeQueue();
    });

    it('should do nothing', () => {
      expect(octokit.issues.addLabels).not.toHaveBeenCalled();
      expect(octokitGraphql).not.toHaveBeenCalled();
      expect(updateMergeQueueModule.updateMergeQueue).not.toHaveBeenCalled();
    });
  });

  describe('skip_auto_merge is used', () => {
    const prUnderTest = {
      number: 123,
      merged: false,
      head: { sha: 'sha' },
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
    };
    const openPrs = [prUnderTest];

    it('should not enable auto-merge on PR if skip_auto_merge is true', async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
      await manageMergeQueue({ skip_auto_merge: 'true' });
      expect(octokitGraphql).not.toHaveBeenCalled();
    });

    it('should enable auto-merge on PR if skip_auto_merge is false', async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
      await manageMergeQueue({ skip_auto_merge: 'false' });
      expect(octokitGraphql).toHaveBeenCalled();
    });
  });

  describe('jump the queue case', () => {
    const prUnderTest = {
      number: 123,
      merged: false,
      head: { sha: 'sha' },
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: JUMP_THE_QUEUE_PR_LABEL }, { name: 'QUEUED FOR MERGE #5' }]
    };
    const openPrs = [
      prUnderTest,
      { number: 1, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }] },
      { number: 2, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #2' }] },
      { number: 3, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #3' }] },
      { number: 4, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #4' }] }
    ];
    beforeEach(() => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
    });

    it('should call updateMergeQueue with correct params', async () => {
      await manageMergeQueue();

      expect(isUserInTeamModule.isUserInTeam).toHaveBeenCalledTimes(0);
      expect(octokit.issues.removeLabel).toHaveBeenCalledTimes(0);
      expect(octokit.issues.createComment).toHaveBeenCalledTimes(0);
      expect(updateMergeQueueModule.updateMergeQueue).toHaveBeenCalledWith(openPrs);
    });

    it('should call updateMergeQueue with correct params when not checking maintainers group', async () => {
      await manageMergeQueue({ allow_only_for_maintainers: 'false' });

      expect(isUserInTeamModule.isUserInTeam).toHaveBeenCalledTimes(0);
      expect(octokit.issues.removeLabel).toHaveBeenCalledTimes(0);
      expect(octokit.issues.createComment).toHaveBeenCalledTimes(0);
      expect(updateMergeQueueModule.updateMergeQueue).toHaveBeenCalledWith(openPrs);
    });

    it('should call updateMergeQueue when user in maintainers group', async () => {
      await manageMergeQueue({ team: 'team', allow_only_for_maintainers: 'true' });

      expect(isUserInTeamModule.isUserInTeam).toHaveBeenCalled();
      expect(octokit.issues.removeLabel).toHaveBeenCalledTimes(0);
      expect(octokit.issues.createComment).toHaveBeenCalledTimes(0);
      expect(updateMergeQueueModule.updateMergeQueue).toHaveBeenCalledWith(openPrs);
    });

    it('should not call updateMergeQueue when user not in maintainers group', async () => {
      await manageMergeQueue({ team: 'not_team', allow_only_for_maintainers: 'true' });

      expect(isUserInTeamModule.isUserInTeam).toHaveBeenCalled();
      expect(octokit.issues.removeLabel).toHaveBeenCalled();
      expect(octokit.issues.createComment).toHaveBeenCalled();
      expect(updateMergeQueueModule.updateMergeQueue).toHaveBeenCalledTimes(0);
    });
  });

  describe('slack reminder integration', () => {
    const login = 'test';
    const slack_webhook_url = 'https://hooks.slack.com/workflows/1234567890';

    it('should notify user if pr is becoming queue position 1', async () => {
      const prUnderTest = {
        number: 123,
        merged: false,
        head: { sha: 'sha' },
        labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
      };
      const openPrs = [prUnderTest];
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
      await manageMergeQueue({ login, slack_webhook_url });

      expect(notifyUserModule.notifyUser).toHaveBeenCalled();
    });

    it('should notify user if pr is already queue position 1', async () => {
      const prUnderTest = {
        number: 123,
        merged: false,
        head: { sha: 'sha' },
        labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }]
      };
      const openPrs = [prUnderTest, { labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #2' }] }];
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
      await manageMergeQueue({ login, slack_webhook_url });

      expect(notifyUserModule.notifyUser).toHaveBeenCalled();
    });

    it('should not notify user if queue position greater than 2', async () => {
      const prUnderTest = {
        number: 123,
        merged: false,
        head: { sha: 'sha' },
        labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #5' }]
      };
      const openPrs = [
        { number: 1, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }] },
        { number: 2, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #2' }] },
        { number: 3, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #3' }] },
        { number: 4, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #4' }] }
      ];
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
      await manageMergeQueue({ login, slack_webhook_url });

      expect(notifyUserModule.notifyUser).not.toHaveBeenCalled();
    });

    it('should not notify user if slack_webhook_url not provided', async () => {
      const openPrs = [{ labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }];
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: {
          merged: false,
          head: { sha: 'sha' },
          labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
        }
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
      await manageMergeQueue({ login });

      expect(notifyUserModule.notifyUser).not.toHaveBeenCalled();
    });

    it('should not notify user if login not provided', async () => {
      const openPrs = [{ labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }];
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: {
          merged: false,
          head: { sha: 'sha' },
          labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
        }
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
      await manageMergeQueue({ slack_webhook_url });

      expect(notifyUserModule.notifyUser).not.toHaveBeenCalled();
    });

    it('should remove user from the queue if email not set on user profile and slack_webhook_url/login are provided', async () => {
      const prUnderTest = {
        number: 123,
        merged: false,
        head: { sha: 'sha' },
        labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
      };
      const openPrs = [prUnderTest];
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      (octokit.users.getByUsername as unknown as Mock<any>).mockImplementation(async () => ({
        data: { email: null }
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
      await manageMergeQueue({ login, slack_webhook_url });

      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({ name: READY_FOR_MERGE_PR_LABEL, issue_number: 123, ...context.repo });
      expect(octokit.issues.createComment).toHaveBeenCalled();
    });
  });

  describe('filters queued prs when there are multiple pages', () => {
    const prUnderTest = {
      number: 123,
      merged: true,
      head: { sha: 'sha' },
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }]
    };
    const queuedPr = { number: 999, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #2' }] };
    const openPrsPage1 = [prUnderTest, { number: 456, labels: [{ name: READY_FOR_MERGE_PR_LABEL }] }];
    const openPrsPage2 = [{ number: 789, labels: [] }, queuedPr];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrsPage1 : page === 2 ? openPrsPage2 : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
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
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({ name: READY_FOR_MERGE_PR_LABEL, issue_number: 123, ...context.repo });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({ name: 'QUEUED FOR MERGE #1', issue_number: 123, ...context.repo });
    });

    it('should call updateMergeQueue with correct params', () => {
      expect(updateMergeQueueModule.updateMergeQueue).toHaveBeenCalledWith([prUnderTest, queuedPr]);
    });
  });

  describe('more than max prs in the queue', () => {
    const prUnderTest = {
      number: 123,
      merged: false,
      head: { sha: 'sha' },
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
    };
    const openPrs = [
      prUnderTest,
      { number: 1, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }] },
      { number: 2, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #2' }] },
      { number: 3, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #3' }] }
    ];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
      await manageMergeQueue({
        max_queue_size: '3'
      });
    });

    it('should not add pr to the queue when it is full', () => {
      expect(octokit.issues.addLabels).not.toHaveBeenCalled();
      expect(octokitGraphql).not.toHaveBeenCalled();
      expect(octokit.issues.createComment).toHaveBeenCalled();
    });
  });

  describe('should not remove queued pr when queue is maxed out', () => {
    const prUnderTest = {
      number: 2,
      merged: false,
      head: { sha: 'sha' },
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #2' }]
    };
    const openPrs = [
      prUnderTest,
      { number: 1, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }] },
      { number: 2, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #2' }] },
      { number: 3, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #3' }] }
    ];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
      await manageMergeQueue({
        max_queue_size: '3'
      });
    });

    it('should not remove queued pr when queue is full', () => {
      expect(octokit.issues.createComment).not.toHaveBeenCalled();
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          sha: 'sha',
          context: MERGE_QUEUE_STATUS,
          state: 'pending',
          description: 'This PR is in line to merge.'
        })
      );
    });
  });

  describe('fewer than max prs in the queue', () => {
    const prUnderTest = {
      number: 1,
      merged: false,
      head: { sha: 'sha' },
      labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
    };
    const openPrs = [
      prUnderTest,
      { number: 1, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #1' }] },
      { number: 2, labels: [{ name: READY_FOR_MERGE_PR_LABEL }, { name: 'QUEUED FOR MERGE #2' }] }
    ];
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
        data: page === 1 ? openPrs : []
      }));
      (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
        data: prUnderTest
      }));
      approvalsSatisfiedSpy.mockResolvedValue(true);
      await manageMergeQueue({
        max_queue_size: '3'
      });
    });

    it('should add pr to the queue when it is not yet full', () => {
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #3'],
        issue_number: 123,
        ...context.repo
      });
      expect(octokitGraphql).toHaveBeenCalled();
      expect(octokit.issues.createComment).not.toHaveBeenCalled();
    });
  });
});
