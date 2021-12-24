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
import { addPrToMergeQueue } from '../../src/helpers/add-pr-to-merge-queue';
import { context } from '@actions/github';
import { octokit } from '../../src/octokit';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      issues: { addLabels: jest.fn() },
      search: { issuesAndPullRequests: jest.fn() }
    }
  }))
}));
(octokit.search.issuesAndPullRequests as unknown as Mocktokit).mockImplementation(async () => ({
  data: {
    total_count: 3
  }
}));

describe('addPrToMergeQueue', () => {
  beforeEach(async () => {
    await addPrToMergeQueue();
  });

  it('should call issuesAndPullRequests search with correct params', () => {
    expect(octokit.search.issuesAndPullRequests).toHaveBeenCalledWith({
      q: 'org%3Aowner%20repo%3Arepo%20type%3Apr%20state%3Aopen%20label%3A%22QUEUED%20FOR%20MERGE%22'
    });
  });

  it('should call add labels with correct params', () => {
    expect(octokit.issues.addLabels).toHaveBeenCalledWith({
      labels: ['QUEUED FOR MERGE #4'],
      issue_number: 123,
      ...context.repo
    });
  });
});
