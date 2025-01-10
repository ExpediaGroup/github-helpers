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
import { getMergeQueuePosition } from '../../src/helpers/get-merge-queue-position';
import { octokitGraphql } from '../../src/octokit';
import { MergeQueueEntry } from '@octokit/graphql-schema';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      repos: {
        listPullRequestsAssociatedWithCommit: jest.fn(({ commit_sha }) => ({ data: [{ number: Number(commit_sha.split('sha')[1]) }] }))
      }
    },
    graphql: jest.fn()
  }))
}));

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
function mockGraphQLResponse(mergeQueueEntries: RecursivePartial<MergeQueueEntry>[]) {
  (octokitGraphql as unknown as Mocktokit).mockImplementation(async () => ({
    repository: {
      mergeQueue: {
        entries: {
          nodes: mergeQueueEntries
        }
      }
    }
  }));
}

describe('getMergeQueuePosition', () => {
  it('should return 1 for PR 1st in the queue', async () => {
    mockGraphQLResponse([
      { position: 1, pullRequest: { number: 123 } },
      { position: 2, pullRequest: { number: 456 } }
    ]);
    const result = await getMergeQueuePosition({ sha: 'sha123' });
    expect(result).toBe(1);
  });

  it('should return 3 for PR 3rd in the queue', async () => {
    mockGraphQLResponse([
      { position: 1, pullRequest: { number: 123 } },
      { position: 2, pullRequest: { number: 456 } },
      { position: 3, pullRequest: { number: 789 } }
    ]);
    const result = await getMergeQueuePosition({ sha: 'sha789' });
    expect(result).toBe(3);
  });
});