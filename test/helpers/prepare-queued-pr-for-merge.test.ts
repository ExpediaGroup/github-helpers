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

import { Mock, beforeEach, afterEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { setupMocks } from '../setup';
import * as core from '@actions/core';

setupMocks();

const { FIRST_QUEUED_PR_LABEL, JUMP_THE_QUEUE_PR_LABEL, READY_FOR_MERGE_PR_LABEL } = await import('../../src/constants');
const { octokit } = await import('../../src/octokit');
const { prepareQueuedPrForMerge } = await import('../../src/helpers/prepare-queued-pr-for-merge');
const manageMergeQueueModule = await import('../../src/helpers/manage-merge-queue');
const { context } = await import('@actions/github');

describe('prepareQueuedPrForMerge', () => {
  let removePrFromQueueSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    mock.clearAllMocks();

    removePrFromQueueSpy = spyOn(manageMergeQueueModule, 'removePrFromQueue' as any).mockImplementation(async () => {});

    (octokit.repos.mergeUpstream as unknown as Mock<any>).mockImplementation(async () => ({ some: 'response' }));
    (octokit.repos.merge as unknown as Mock<any>).mockImplementation(async () => ({ some: 'response' }));
  });

  afterEach(() => {
    removePrFromQueueSpy.mockRestore();
  });
  const ref = 'branch name';

  describe('top queued pr exists', () => {
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async () => ({
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
      await prepareQueuedPrForMerge();
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

  describe('top queued pr exists and head is fork branch', () => {
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async () => ({
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
              ref,
              user: {
                login: 'user'
              }
            },
            base: {
              user: {
                login: 'owner'
              },
              repo: {
                default_branch: 'master'
              }
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
      await prepareQueuedPrForMerge();
    });

    it('should call pulls.list with correct params', () => {
      expect(octokit.pulls.list).toHaveBeenCalledWith({
        state: 'open',
        per_page: 100,
        ...context.repo
      });
    });

    it('should call repos.mergeUpstream with correct params', () => {
      expect(octokit.repos.mergeUpstream).toHaveBeenCalledWith({
        ...context.repo,
        branch: 'master'
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
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async () => ({
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
      await prepareQueuedPrForMerge();
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
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async () => ({
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
      await prepareQueuedPrForMerge();
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
    const firstInQueue = {
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
    };
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) =>
        page === 1 || !page
          ? {
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
                firstInQueue
              ]
            }
          : { data: [] }
      );
      (octokit.repos.merge as unknown as Mock<any>).mockRejectedValue({ status: 409 });
      await prepareQueuedPrForMerge();
    });

    it('should remove PR from queue and call core.error', () => {
      expect(removePrFromQueueSpy).toHaveBeenCalledWith(firstInQueue);
      expect(core.setFailed).toHaveBeenCalled();
    });
  });

  describe('merge conflict with no_evict_upon_conflict', () => {
    const firstInQueue = {
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
    };
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) =>
        page === 1 || !page
          ? {
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
                firstInQueue
              ]
            }
          : { data: [] }
      );
      (octokit.repos.merge as unknown as Mock<any>).mockRejectedValue({ status: 409 });
      (core.getInput as Mock<any>).mockReturnValue('true');
      await prepareQueuedPrForMerge();
    });

    it('should NOT remove PR from queue and call core.info', () => {
      expect(removePrFromQueueSpy).not.toHaveBeenCalled();
      expect(core.info).toHaveBeenCalled();
    });
  });

  describe('merge conflict without no_evict_upon_conflict', () => {
    const firstInQueue = {
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
    };
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) =>
        page === 1 || !page
          ? {
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
                firstInQueue
              ]
            }
          : { data: [] }
      );
      (octokit.repos.merge as unknown as Mock<any>).mockRejectedValue({ status: 409 });
      (core.getInput as Mock<any>).mockReturnValue('');
      await prepareQueuedPrForMerge();
    });

    it('should remove PR from queue and call core.error', () => {
      expect(removePrFromQueueSpy).toHaveBeenCalled();
      expect(core.setFailed).toHaveBeenCalled();
    });
  });

  describe('merge conflict when update fork default branch with upstream', () => {
    const firstInQueue = {
      head: {
        ref,
        user: {
          login: 'user'
        }
      },
      base: {
        user: {
          login: 'owner'
        },
        repo: {
          default_branch: 'master'
        }
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
    };
    beforeEach(async () => {
      (octokit.pulls.list as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) =>
        page === 1 || !page
          ? {
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
                firstInQueue
              ]
            }
          : { data: [] }
      );
      (octokit.repos.mergeUpstream as unknown as Mock<any>).mockRejectedValue({ status: 409 });
      await prepareQueuedPrForMerge();
    });

    it('should call core.error', () => {
      expect(core.setFailed).toHaveBeenCalled();
    });
  });
});
