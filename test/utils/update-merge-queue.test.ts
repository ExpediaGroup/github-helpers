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

import { MERGE_QUEUE_STATUS } from '../../src/constants';
import { Mocktokit } from '../types';
import { PullRequestSearchResults } from '../../src/types';
import { context } from '@actions/github';
import { octokit } from '../../src/octokit';
import { removeLabelIfExists } from '../../src/helpers/remove-label';
import { setCommitStatus } from '../../src/helpers/set-commit-status';
import { updateMergeQueue } from '../../src/utils/update-merge-queue';

jest.mock('../../src/helpers/remove-label');
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
        number: 123,
        labels: [{ name: 'QUEUED FOR MERGE #2' }]
      },
      {
        number: 456,
        labels: [{ name: 'QUEUED FOR MERGE #3' }]
      }
    ];
    beforeEach(async () => {
      await updateMergeQueue(queuedPrs as PullRequestSearchResults);
    });

    it('should call add labels with correct params', () => {
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #1'],
        issue_number: 123,
        ...context.repo
      });
      expect(setCommitStatus).toHaveBeenCalledWith({
        sha: 'sha123',
        context: MERGE_QUEUE_STATUS,
        state: 'success',
        description: 'This PR is next to merge.'
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
  });

  describe('pr taken out of queue case', () => {
    const queuedPrs = [
      {
        number: 123,
        labels: [{ name: 'QUEUED FOR MERGE #1' }]
      },
      {
        number: 456,
        labels: [{ name: 'QUEUED FOR MERGE #3' }]
      }
    ];
    beforeEach(async () => {
      await updateMergeQueue(queuedPrs as PullRequestSearchResults);
    });

    it('should call add labels with correct params', () => {
      expect(octokit.issues.addLabels).not.toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #0'],
        issue_number: 123,
        ...context.repo
      });
      expect(setCommitStatus).not.toHaveBeenCalled();
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
