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
import { context } from '@actions/github';
import { commentIssueDueDate } from '../../src/helpers/comment-issue-due-date';
import { octokit } from '../../src/octokit';
import { PRIORITY_1, PRIORITY_2, PRIORITY_3, PRIORITY_4 } from '../../src/constants';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: { issues: { get: jest.fn(), createComment: jest.fn() } }
  }))
}));

jest.spyOn(Date, 'now').mockImplementation(() => new Date('2023-09-26T10:00:00Z').getTime());

describe('commentIssueDueDate', () => {
  it('should add due dates correctly based on priority label', async () => {
    // Critical: 2 days
    (octokit.issues.get as unknown as Mocktokit).mockResolvedValueOnce({
      status: '200',
      data: {
        issue_number: 123,
        created_at: Date.now(),
        labels: [PRIORITY_1]
      }
    });
    await commentIssueDueDate({ label: PRIORITY_1 });
    expect(octokit.issues.createComment).toHaveBeenCalledWith({
      body: 'This issue is due on Thu Sep 28 2023',
      issue_number: 123,
      ...context.repo
    });

    // High: 14 days
    (octokit.issues.get as unknown as Mocktokit).mockResolvedValueOnce({
      status: '200',
      data: {
        issue_number: 123,
        created_at: Date.now(),
        labels: [PRIORITY_2]
      }
    });
    await commentIssueDueDate({ label: PRIORITY_2 });
    expect(octokit.issues.createComment).toHaveBeenCalledWith({
      body: 'This issue is due on Tue Oct 10 2023',
      issue_number: 123,
      ...context.repo
    });
    // Medium: 45 days
    (octokit.issues.get as unknown as Mocktokit).mockResolvedValueOnce({
      status: '200',
      data: {
        issue_number: 123,
        created_at: Date.now(),
        labels: [PRIORITY_3]
      }
    });
    await commentIssueDueDate({ label: PRIORITY_3 });
    expect(octokit.issues.createComment).toHaveBeenCalledWith({
      body: 'This issue is due on Fri Nov 10 2023',
      issue_number: 123,
      ...context.repo
    });
    // Low: 90 days
    (octokit.issues.get as unknown as Mocktokit).mockResolvedValueOnce({
      status: '200',
      data: {
        issue_number: 123,
        created_at: Date.now(),
        labels: [PRIORITY_4]
      }
    });
    await commentIssueDueDate({ label: PRIORITY_4 });
    expect(octokit.issues.createComment).toHaveBeenCalledWith({
      body: 'This issue is due on Mon Dec 25 2023',
      issue_number: 123,
      ...context.repo
    });
  });
});
