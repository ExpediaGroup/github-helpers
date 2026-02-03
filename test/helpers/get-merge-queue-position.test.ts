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

import { describe, it, expect, Mock } from 'bun:test';
import { setupMocks } from '../setup';
import { MergeQueueEntry } from '@octokit/graphql-schema';

setupMocks();

const { getMergeQueuePosition } = await import('../../src/helpers/get-merge-queue-position');
const { octokitGraphql } = await import('../../src/octokit');
const { context } = await import('@actions/github');

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
function mockGraphQLResponse(mergeQueueEntries: RecursivePartial<MergeQueueEntry>[]) {
  (octokitGraphql as unknown as Mock<any>).mockImplementation(async () => ({
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
    context.ref = 'refs/heads/gh-readonly-queue/default-branch/pr-123-f0d9a4cb862b13cdaab6522f72d6dc17e4336b7f';
    mockGraphQLResponse([
      { position: 1, pullRequest: { number: 123 } },
      { position: 2, pullRequest: { number: 456 } }
    ]);
    const result = await getMergeQueuePosition({});
    expect(result).toBe(1);
  });

  it('should return 3 for PR 3rd in the queue', async () => {
    context.ref = 'refs/heads/gh-readonly-queue/default-branch/pr-789-f0d9a4cb862b13cdaab6522f72d6dc17e4336b7f';
    mockGraphQLResponse([
      { position: 1, pullRequest: { number: 123 } },
      { position: 2, pullRequest: { number: 456 } },
      { position: 3, pullRequest: { number: 789 } }
    ]);
    const result = await getMergeQueuePosition({});
    expect(result).toBe(3);
  });
});
