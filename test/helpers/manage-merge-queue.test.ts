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

import { Mocktokit } from '../types';
import { manageMergeQueue } from '../../src/helpers/manage-merge-queue';
import { octokit } from '../../src/octokit';
import { removeLabel } from '../../src/helpers/remove-label';
import { updateMergeQueue } from '../../src/utils/update-merge-queue';

jest.mock('../../src/helpers/add-labels');
jest.mock('../../src/utils/update-merge-queue');
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
(octokit.issues.listLabelsOnIssue as unknown as Mocktokit).mockImplementation(async () => ({
  data: [
    {
      name: 'QUEUED FOR MERGE #2'
    },
    {
      name: 'QUEUED FOR MERGE #3'
    }
  ]
}));
const items = ['some', 'items'];
(octokit.search.issuesAndPullRequests as unknown as Mocktokit).mockImplementation(async () => ({
  data: {
    total_count: 3,
    items
  }
}));

describe('manageMergeQueue', () => {
  describe('pr merged case', () => {
    beforeEach(async () => {
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: true,
          labels: [{ name: 'QUEUED FOR MERGE #2' }]
        }
      }));
      await manageMergeQueue();
    });

    it('should call issuesAndPullRequests search with correct params', () => {
      expect(octokit.search.issuesAndPullRequests).toHaveBeenCalledWith({
        q: 'org%3Aowner%20repo%3Arepo%20type%3Apr%20state%3Aopen%20label%3A%22QUEUED%20FOR%20MERGE%22'
      });
    });

    it('should call remove label with correct params', () => {
      expect(removeLabel).toHaveBeenCalledWith({
        label: 'QUEUED FOR MERGE #2',
        pull_number: '123'
      });
    });

    it('should call updateMergeQueue with correct params', () => {
      expect(updateMergeQueue).toHaveBeenCalledWith(items);
    });
  });
});
