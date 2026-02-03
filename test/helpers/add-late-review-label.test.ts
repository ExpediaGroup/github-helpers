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

import { describe, it, expect, beforeEach, Mock } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

const { LATE_REVIEW } = await import('../../src/constants');
const { addLateReviewLabel } = await import('../../src/helpers/add-late-review-label');
const { context } = await import('@actions/github');
const { octokit } = await import('../../src/octokit');

describe('addLateReviewLabel', () => {
  describe('Late Review', () => {
    beforeEach(() => {
      (octokit.pulls.list as unknown as Mock<any>)
        .mockResolvedValueOnce({
          status: '200',
          data: [
            {
              number: 123,
              requested_reviewers: [{ id: 234 }],
              updated_at: '2022-07-25T20:09:21Z'
            }
          ]
        })
        .mockResolvedValueOnce({
          status: '200',
          data: []
        });
    });

    it('should add Late Review label to the pr', async () => {
      await addLateReviewLabel({
        days: '1',
        ...context.repo
      });

      expect(octokit.pulls.list).toHaveBeenCalledWith({
        page: 1,
        per_page: 100,
        sort: 'updated',
        direction: 'desc',
        state: 'open',
        ...context.repo
      });

      expect(octokit.pulls.list).toHaveBeenCalledWith({
        page: 2,
        per_page: 100,
        sort: 'updated',
        direction: 'desc',
        state: 'open',
        ...context.repo
      });

      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: [LATE_REVIEW],
        issue_number: 123,
        ...context.repo
      });
    });

    it('should not add any labels to the pr', async () => {
      await addLateReviewLabel({
        days: '1',
        ...context.repo
      });

      expect(octokit.pulls.list).toHaveBeenCalledWith({
        page: 1,
        per_page: 100,
        sort: 'updated',
        direction: 'desc',
        state: 'open',
        ...context.repo
      });

      expect(octokit.pulls.list).toHaveBeenCalledWith({
        page: 2,
        per_page: 100,
        sort: 'updated',
        direction: 'desc',
        state: 'open',
        ...context.repo
      });

      expect(octokit.issues.addLabels).not.toHaveBeenCalledWith();
    });
  });
});
