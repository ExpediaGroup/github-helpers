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

import { Mock, beforeEach, describe, expect, it, mock } from 'bun:test';
import type { Mocktokit } from '../types';

process.env.INPUT_GITHUB_TOKEN = 'mock-token';

const mockOctokit = {
  rest: {
    actions: {
      listWorkflowRunsForRepo: mock(() => ({})),
      reRunWorkflow: mock(() => ({}))
    },
    checks: {
      listForRef: mock(() => ({})),
      update: mock(() => ({}))
    },
    git: {
      deleteRef: mock(() => ({})),
      getCommit: mock(() => ({}))
    },
    issues: {
      addAssignees: mock(() => ({})),
      addLabels: mock(() => ({})),
      createComment: mock(() => ({})),
      get: mock(() => ({})),
      listComments: mock(() => ({})),
      listForRepo: mock(() => ({})),
      removeLabel: mock(() => ({})),
      update: mock(() => ({})),
      updateComment: mock(() => ({}))
    },
    pulls: {
      create: mock(() => ({})),
      createReview: mock(() => ({})),
      get: mock(() => ({})),
      list: mock(() => ({})),
      listFiles: mock(() => ({})),
      listReviews: mock(() => ({})),
      merge: mock(() => ({})),
      update: mock(() => ({}))
    },
    repos: {
      compareCommitsWithBasehead: mock(() => ({})),
      createCommitStatus: mock(() => ({})),
      createDeployment: mock(() => ({})),
      createDeploymentStatus: mock(() => ({})),
      deleteAnEnvironment: mock(() => ({})),
      deleteDeployment: mock(() => ({})),
      get: mock(() => ({})),
      getCombinedStatusForRef: mock(() => ({})),
      listBranches: mock(() => ({})),
      listBranchesForHeadCommit: mock(() => ({})),
      listCommitStatusesForRef: mock(() => ({})),
      listDeploymentStatuses: mock(() => ({})),
      listDeployments: mock(() => ({})),
      listPullRequestsAssociatedWithCommit: mock(() => ({})),
      merge: mock(() => ({})),
      mergeUpstream: mock(() => ({}))
    },
    teams: {
      listMembersInOrg: mock(() => ({}))
    },
    users: {
      getByUsername: mock(() => ({}))
    }
  },
  graphql: mock(() => ({}))
};

mock.module('@actions/core', () => ({
  getInput: () => 'mock-token',
  setOutput: () => {},
  setFailed: () => {},
  info: () => {},
  warning: () => {},
  error: () => {}
}));

mock.module('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: mock(() => mockOctokit)
}));

mock.module('../../src/octokit', () => ({
  octokit: mockOctokit.rest,
  octokitGraphql: mockOctokit.graphql
}));

const { FIRST_QUEUED_PR_LABEL, JUMP_THE_QUEUE_PR_LABEL, READY_FOR_MERGE_PR_LABEL } = await import('../../src/constants');
const { octokit } = await import('../../src/octokit');
const { prepareQueuedPrForMerge } = await import('../../src/helpers/prepare-queued-pr-for-merge');
const { removePrFromQueue } = await import('../../src/helpers/manage-merge-queue');
const { context } = await import('@actions/github');

(octokit.repos.mergeUpstream as unknown as Mocktokit).mockImplementation(async () => ({ some: 'response' }));
(octokit.repos.merge as unknown as Mocktokit).mockImplementation(async () => ({ some: 'response' }));

describe('prepareQueuedPrForMerge', () => {
  const ref = 'branch name';

  describe('top queued pr exists', () => {
    beforeEach(async () => {
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
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async ({ page }) =>
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
      (octokit.repos.merge as unknown as Mocktokit).mockRejectedValue({ status: 409 });
      await prepareQueuedPrForMerge();
    });

    it('should remove PR from queue and call core.error', () => {
      expect(removePrFromQueue).toHaveBeenCalledWith(firstInQueue);
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
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async ({ page }) =>
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
      (octokit.repos.merge as unknown as Mocktokit).mockRejectedValue({ status: 409 });
      (core.getInput as Mock<any>).mockReturnValue('true');
      await prepareQueuedPrForMerge();
    });

    it('should NOT remove PR from queue and call core.info', () => {
      expect(removePrFromQueue).not.toHaveBeenCalled();
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
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async ({ page }) =>
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
      (octokit.repos.merge as unknown as Mocktokit).mockRejectedValue({ status: 409 });
      (core.getInput as Mock<any>).mockReturnValue('');
      await prepareQueuedPrForMerge();
    });

    it('should remove PR from queue and call core.error', () => {
      expect(removePrFromQueue).toHaveBeenCalled();
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
      (octokit.pulls.list as unknown as Mocktokit).mockImplementation(async ({ page }) =>
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
      (octokit.repos.mergeUpstream as unknown as Mocktokit).mockRejectedValue({ status: 409 });
      await prepareQueuedPrForMerge();
    });

    it('should call core.error', () => {
      expect(core.setFailed).toHaveBeenCalled();
    });
  });
});
