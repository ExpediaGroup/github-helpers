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

import * as core from '@actions/core';
import { FIRST_QUEUED_PR_LABEL, JUMP_THE_QUEUE_PR_LABEL, READY_FOR_MERGE_PR_LABEL } from '../../src/constants';
import { Mocktokit } from '../types';
import { context } from '@actions/github';
import { octokit } from '../../src/octokit';
import { prepareQueuedPrForMerge } from '../../src/helpers/prepare-queued-pr-for-merge';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: { list: jest.fn() },
      repos: { merge: jest.fn() },
      issues: {
        removeLabel: jest.fn(),
        createComment: jest.fn()
      }
    }
  }))
}));
(octokit.repos.merge as unknown as Mocktokit).mockImplementation(async () => ({ some: 'response' }));

describe('prepareQueuedPrForMerge', () => {
  const ref = 'branch name';

  describe('top queued pr exists', () => {
    beforeEach(() => {
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async () => ({
        data: [
          {
            head: {
              ref: 'other branch name'
            },
            state: 'open',
            labels: [
              {
                name: 'CORE APPROVED'
              }
            ]
          },
          {
            head: {
              ref
            },
            state: 'open',
            labels: [
              {
                name: READY_FOR_MERGE_PR_LABEL
              },
              {
                name: FIRST_QUEUED_PR_LABEL
              }
            ]
          }
        ]
      }));
      prepareQueuedPrForMerge();
    });

    it('should call pulls.list with correct params', () => {
      expect(octokit.pulls.list).toHaveBeenCalledWith({
        state: 'open',
        per_page: 100,
        ...context.repo
      });
    });

    it('should call repos.merge with correct params', () => {
      expect(octokit.repos.merge).toHaveBeenCalledWith({
        base: ref,
        head: 'HEAD',
        ...context.repo
      });
    });
  });

  describe('pr jumped the queue', () => {
    const jumpQueueBranch = 'jump queue';
    beforeEach(() => {
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async () => ({
        data: [
          {
            head: {
              ref: 'other branch name'
            },
            state: 'open',
            labels: [
              {
                name: 'CORE APPROVED'
              }
            ]
          },
          {
            head: {
              ref
            },
            state: 'open',
            labels: [
              {
                name: READY_FOR_MERGE_PR_LABEL
              },
              {
                name: FIRST_QUEUED_PR_LABEL
              }
            ]
          },
          {
            head: {
              ref: jumpQueueBranch
            },
            state: 'open',
            labels: [
              {
                name: JUMP_THE_QUEUE_PR_LABEL
              },
              {
                name: READY_FOR_MERGE_PR_LABEL
              }
            ]
          }
        ]
      }));
      prepareQueuedPrForMerge();
    });

    it('should call pulls.list with correct params', () => {
      expect(octokit.pulls.list).toHaveBeenCalledWith({
        state: 'open',
        per_page: 100,
        ...context.repo
      });
    });

    it('should call repos.merge with correct params', () => {
      expect(octokit.repos.merge).toHaveBeenCalledWith({
        base: jumpQueueBranch,
        head: 'HEAD',
        ...context.repo
      });
    });
  });

  describe('no queued prs exist', () => {
    beforeEach(() => {
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async () => ({
        data: [
          {
            head: {
              ref: 'some branch name'
            },
            state: 'open',
            labels: [
              {
                name: 'CORE APPROVED'
              }
            ]
          }
        ]
      }));
      prepareQueuedPrForMerge();
    });

    it('should call pulls.list with correct params', () => {
      expect(octokit.pulls.list).toHaveBeenCalledWith({
        state: 'open',
        per_page: 100,
        ...context.repo
      });
    });

    it('should not call repos.merge', () => {
      expect(octokit.repos.merge).not.toHaveBeenCalled();
    });
  });

  describe('merge conflict case', () => {
    beforeEach(() => {
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async () => ({
        data: [
          {
            head: {
              ref: 'other branch name'
            },
            state: 'open',
            labels: [
              {
                name: 'CORE APPROVED'
              }
            ]
          },
          {
            number: 123,
            head: {
              ref
            },
            state: 'open',
            labels: [
              {
                name: READY_FOR_MERGE_PR_LABEL
              },
              {
                name: FIRST_QUEUED_PR_LABEL
              }
            ]
          }
        ]
      }));
      (octokit.repos.merge as unknown as Mocktokit).mockRejectedValue({ status: 409 });
      prepareQueuedPrForMerge();
    });

    it('should call core.info', () => {
      expect(core.info).toHaveBeenCalled();
    });
  });
});
