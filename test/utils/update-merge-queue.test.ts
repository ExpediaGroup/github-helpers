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

import { PullRequestSearchResults } from '../../src/types';
import { context } from '@actions/github';
import { octokit } from '../../src/octokit';
import { updateMergeQueue } from '../../src/utils/update-merge-queue';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: { get: jest.fn() },
      issues: {
        addLabels: jest.fn(),
        removeLabel: jest.fn(),
        listLabelsOnIssue: jest.fn()
      },
      search: { issuesAndPullRequests: jest.fn() }
    }
  }))
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
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #2'],
        issue_number: 456,
        ...context.repo
      });
    });

    it('should call remove label with correct params', () => {
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
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: ['QUEUED FOR MERGE #2'],
        issue_number: 456,
        ...context.repo
      });
    });

    it('should call remove label with correct params', () => {
      expect(octokit.issues.removeLabel).not.toHaveBeenCalledWith({
        issue_number: 123,
        name: 'QUEUED FOR MERGE #1',
        ...context.repo
      });
      expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
        issue_number: 456,
        name: 'QUEUED FOR MERGE #3',
        ...context.repo
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
