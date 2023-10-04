/*
Copyright 2023 Expedia, Inc.
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

import { manageIssueDueDates } from '../../src/helpers/manage-issue-due-dates';
import { context } from '@actions/github';
import { octokit } from '../../src/octokit';
import { Mocktokit } from '../types';
import { ALMOST_OVERDUE_ISSUE, OVERDUE_ISSUE, PRIORITY_1, PRIORITY_2, PRIORITY_3, PRIORITY_4 } from '../../src/constants';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({
    rest: { issues: { addLabels: jest.fn(), listForRepo: jest.fn(), createComment: jest.fn(), listComments: jest.fn() } }
  }))
}));

jest.spyOn(Date, 'now').mockImplementation(() => new Date('2023-09-26T10:00:00Z').getTime());

describe('manageIssueDueDates', () => {
  beforeEach(() => {});

  it('should add due date comments to PRs with any priority label', async () => {
    (octokit.issues.listForRepo as unknown as Mocktokit).mockResolvedValueOnce({
      status: '200',
      data: [
        {
          number: 123,
          labels: [PRIORITY_1],
          created_at: Date.now()
        },
        {
          number: 234,
          labels: [PRIORITY_2],
          created_at: Date.now()
        },
        {
          number: 345,
          labels: [PRIORITY_3],
          created_at: Date.now()
        },
        {
          number: 456,
          labels: [PRIORITY_4],
          created_at: Date.now()
        }
      ]
    });

    await manageIssueDueDates({});
    expect(octokit.issues.createComment).toHaveBeenCalledWith({
      body: 'This issue is due on Thu Sep 28 2023',
      issue_number: 123,
      ...context.repo
    });
    expect(octokit.issues.addLabels).toHaveBeenCalledWith({
      labels: [ALMOST_OVERDUE_ISSUE],
      issue_number: 123,
      ...context.repo
    });
    expect(octokit.issues.createComment).toHaveBeenCalledWith({
      body: 'This issue is due on Tue Oct 10 2023',
      issue_number: 234,
      ...context.repo
    });
    expect(octokit.issues.createComment).toHaveBeenCalledWith({
      body: 'This issue is due on Fri Nov 10 2023',
      issue_number: 345,
      ...context.repo
    });
    expect(octokit.issues.createComment).toHaveBeenCalledWith({
      body: 'This issue is due on Mon Dec 25 2023',
      issue_number: 456,
      ...context.repo
    });
    expect(octokit.issues.listComments).not.toHaveBeenCalled();
  });

  it('should add overdue label to a PR with high priority that is 20 days old', async () => {
    (octokit.issues.listForRepo as unknown as Mocktokit)
      .mockResolvedValueOnce({
        status: '200',
        data: [
          {
            number: 123,
            labels: [PRIORITY_2],
            created_at: '2023-09-06T20:09:21Z',
            assignee: 'octocat'
          }
        ]
      })
      .mockResolvedValueOnce({
        status: '200',
        data: []
      });

    await manageIssueDueDates({});

    expect(octokit.issues.listForRepo).toHaveBeenCalledWith({
      page: 1,
      per_page: 100,
      sort: 'created',
      direction: 'desc',
      state: 'open',
      labels: [PRIORITY_1, PRIORITY_2, PRIORITY_3, PRIORITY_4].join(','),
      ...context.repo
    });

    expect(octokit.issues.listForRepo).toHaveBeenCalledWith({
      page: 2,
      per_page: 100,
      sort: 'created',
      direction: 'desc',
      state: 'open',
      labels: [PRIORITY_1, PRIORITY_2, PRIORITY_3, PRIORITY_4].join(','),
      ...context.repo
    });

    expect(octokit.issues.addLabels).toHaveBeenCalledWith({ labels: [OVERDUE_ISSUE], issue_number: 123, ...context.repo });
    expect(octokit.issues.createComment).toHaveBeenCalledWith({
      body: '@octocat, this issue assigned to you is now overdue',
      issue_number: 123,
      ...context.repo
    });
  });

  it('should add due soon label to a PR with low priority that is 85 days old', async () => {
    (octokit.issues.listForRepo as unknown as Mocktokit)
      .mockResolvedValueOnce({
        status: '200',
        data: [
          {
            number: 123,
            labels: [PRIORITY_4],
            created_at: '2023-07-03T20:09:21Z',
            assignee: 'octocat'
          }
        ]
      })
      .mockResolvedValueOnce({
        status: '200',
        data: []
      });

    (octokit.issues.listComments as unknown as Mocktokit)
      .mockResolvedValueOnce({
        status: '200',
        data: [{ body: 'This issue is due on Sun Oct 1 2023' }]
      })
      .mockResolvedValueOnce({ status: '200', data: [] });

    await manageIssueDueDates({});

    expect(octokit.issues.listForRepo).toHaveBeenCalledWith({
      page: 1,
      per_page: 100,
      sort: 'created',
      direction: 'desc',
      state: 'open',
      labels: [PRIORITY_1, PRIORITY_2, PRIORITY_3, PRIORITY_4].join(','),
      ...context.repo
    });

    expect(octokit.issues.listForRepo).toHaveBeenCalledWith({
      page: 2,
      per_page: 100,
      sort: 'created',
      direction: 'desc',
      state: 'open',
      labels: [PRIORITY_1, PRIORITY_2, PRIORITY_3, PRIORITY_4].join(','),
      ...context.repo
    });

    expect(octokit.issues.addLabels).toHaveBeenCalledWith({ labels: [ALMOST_OVERDUE_ISSUE], issue_number: 123, ...context.repo });
    expect(octokit.issues.createComment).toHaveBeenCalledWith({
      body: '@octocat, this issue assigned to you is now due soon',
      issue_number: 123,
      ...context.repo
    });
  });

  it('should not add a label to a PR without any priority labels, regardless of creation date', async () => {
    (octokit.issues.listForRepo as unknown as Mocktokit)
      .mockResolvedValueOnce({
        status: '200',
        data: [
          {
            number: 123,
            created_at: '2020-05-29T20:09:21Z',
            assignee: 'octocat',
            labels: []
          }
        ]
      })
      .mockResolvedValueOnce({
        status: '200',
        data: []
      });

    await manageIssueDueDates({});

    expect(octokit.issues.listForRepo).toHaveBeenCalledWith({
      page: 1,
      per_page: 100,
      sort: 'created',
      direction: 'desc',
      state: 'open',
      labels: [PRIORITY_1, PRIORITY_2, PRIORITY_3, PRIORITY_4].join(','),
      ...context.repo
    });

    expect(octokit.issues.listForRepo).toHaveBeenCalledWith({
      page: 2,
      per_page: 100,
      sort: 'created',
      direction: 'desc',
      state: 'open',
      labels: [PRIORITY_1, PRIORITY_2, PRIORITY_3, PRIORITY_4].join(','),
      ...context.repo
    });

    expect(octokit.issues.createComment).not.toHaveBeenCalled();
    expect(octokit.issues.addLabels).not.toHaveBeenCalled();
  });

  it('should not add a label to a PR with medium priority that is 10 days old', async () => {
    (octokit.issues.listForRepo as unknown as Mocktokit)
      .mockResolvedValueOnce({
        status: '200',
        data: [
          {
            number: 123,
            labels: [PRIORITY_3],
            created_at: '2023-09-16T20:09:21Z',
            assignee: 'octocat'
          }
        ]
      })
      .mockResolvedValueOnce({
        status: '200',
        data: []
      });

    (octokit.issues.listComments as unknown as Mocktokit)
      .mockResolvedValueOnce({
        status: '200',
        data: [
          {
            body: 'This issue is due on Tue Oct 31 2023'
          }
        ]
      })
      .mockResolvedValueOnce({
        status: '200',
        data: []
      });

    await manageIssueDueDates({});

    expect(octokit.issues.listForRepo).toHaveBeenCalledWith({
      page: 1,
      per_page: 100,
      sort: 'created',
      direction: 'desc',
      state: 'open',
      labels: [PRIORITY_1, PRIORITY_2, PRIORITY_3, PRIORITY_4].join(','),
      ...context.repo
    });

    expect(octokit.issues.listForRepo).toHaveBeenCalledWith({
      page: 2,
      per_page: 100,
      sort: 'created',
      direction: 'desc',
      state: 'open',
      labels: [PRIORITY_1, PRIORITY_2, PRIORITY_3, PRIORITY_4].join(','),
      ...context.repo
    });
    expect(octokit.issues.addLabels).not.toHaveBeenCalled();
  });
});
