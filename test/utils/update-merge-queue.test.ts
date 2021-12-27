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
import { addLabels } from '../../src/helpers/add-labels';
import { removeLabel } from '../../src/helpers/remove-label';
import { updateMergeQueue } from '../../src/utils/update-merge-queue';

jest.mock('../../src/helpers/add-labels');
jest.mock('../../src/helpers/remove-label');
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
      expect(addLabels).toHaveBeenCalledWith({
        pull_number: '123',
        labels: 'QUEUED FOR MERGE #1'
      });
      expect(addLabels).toHaveBeenCalledWith({
        pull_number: '456',
        labels: 'QUEUED FOR MERGE #2'
      });
    });

    it('should call remove label with correct params', () => {
      expect(removeLabel).toHaveBeenCalledWith({
        pull_number: '123',
        label: 'QUEUED FOR MERGE #2'
      });
      expect(removeLabel).toHaveBeenCalledWith({
        pull_number: '456',
        label: 'QUEUED FOR MERGE #3'
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
      expect(addLabels).not.toHaveBeenCalledWith({
        pull_number: '123',
        labels: 'QUEUED FOR MERGE #0'
      });
      expect(addLabels).toHaveBeenCalledWith({
        pull_number: '456',
        labels: 'QUEUED FOR MERGE #2'
      });
    });

    it('should call remove label with correct params', () => {
      expect(removeLabel).not.toHaveBeenCalledWith({
        pull_number: '123',
        label: 'QUEUED FOR MERGE #1'
      });
      expect(removeLabel).toHaveBeenCalledWith({
        pull_number: '456',
        label: 'QUEUED FOR MERGE #3'
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
