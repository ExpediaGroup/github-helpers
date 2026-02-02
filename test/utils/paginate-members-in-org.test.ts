/*
Copyright 2025 Expedia, Inc.
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

import { describe, it, expect, mock } from 'bun:test';

process.env.INPUT_GITHUB_TOKEN = 'mock-token';

const generateMember = (baseMember: object): any => {
  return {
    login: 'login',
    id: 0,
    node_id: 'node_id',
    avatar_url: 'avatar_url',
    gravatar_id: 'gravatar_id',
    url: 'url',
    html_url: 'html_url',
    followers_url: 'followers_url',
    following_url: 'following_url',
    gists_url: 'gists_url',
    starred_url: 'starred_url',
    subscriptions_url: 'subscriptions_url',
    organizations_url: 'organizations_url',
    repos_url: 'repos_url',
    events_url: 'events_url',
    received_events_url: 'received_events_url',
    type: 'type',
    site_admin: false,
    ...baseMember
  };
};

const mockListMembersInOrg = mock(async (args: any) => {
  let teamMembers: any[] = [];
  switch (args.team_slug) {
    case 'empty-team':
      break;
    case 'small-team':
      teamMembers = [
        generateMember({ login: 'user1', id: 1 }),
        generateMember({ login: 'user2', id: 2 }),
        generateMember({ login: 'user3', id: 3 })
      ];
      break;
    case 'large-team':
      const teamSize = 250;
      const page = args.page || 1;
      const pageOffset = (page - 1) * 100;
      const pageSize = Math.min(teamSize - pageOffset, 100);
      for (let i = 0; i < pageSize; i++) {
        teamMembers.push(generateMember({ login: `user${i + pageOffset}`, id: i + pageOffset }));
      }
      break;
  }
  return { data: teamMembers };
});

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
  getInput: (input: string) => (input === 'input2' ? '' : input),
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

const { paginateMembersInOrg } = await import('../../src/utils/paginate-members-in-org');

describe('paginateMembersInOrg', () => {
  describe('return all team members', () => {
    it('when the team has no members', async () => {
      const response = await paginateMembersInOrg('empty-team');
      expect(response).toEqual([]);
    });

    it('when the team has only a few members', async () => {
      const response = await paginateMembersInOrg('small-team');
      expect(response.length).toBe(3);
      expect(response[0]?.login).toBe('user1');
      expect(response[0]?.id).toBe(1);
    });

    it('when the team has more than 100 members', async () => {
      const response = await paginateMembersInOrg('large-team');
      expect(response.length).toBe(250);
      expect(response[0]?.login).toBe('user0');
      expect(response[0]?.id).toBe(0);
      expect(response[249]?.login).toBe('user249');
      expect(response[249]?.id).toBe(249);
    });
  });
});
