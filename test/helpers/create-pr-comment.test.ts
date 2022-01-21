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
import { createPrComment } from '../../src/helpers/create-pr-comment';
import { octokit } from '../../src/octokit';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      repos: {
        listPullRequestsAssociatedWithCommit: jest.fn()
      },
      issues: {
        createComment: jest.fn(),
        listComments: jest.fn(),
        updateComment: jest.fn()
      }
    }
  }))
}));

(octokit.issues.listComments as unknown as Mocktokit).mockImplementation(async () => ({
  data: [
    {
      id: 12345,
      body: 'body',
      user: {
        login: 'login'
      }
    },
    {
      id: 456,
      body: 'some other body',
      user: {
        login: 'some other login'
      }
    }
  ]
}));
(octokit.repos.listPullRequestsAssociatedWithCommit as unknown as Mocktokit).mockImplementation(async () => ({
  data: [
    {
      number: 112233
    },
    {
      number: 456
    }
  ]
}));

describe('createPrComment', () => {
  describe('create comment case', () => {
    const body = 'body';

    beforeEach(() => {
      createPrComment({ body });
    });

    it('should call createComment with correct params', () => {
      expect(octokit.issues.createComment).toHaveBeenCalledWith({
        body,
        issue_number: 123,
        ...context.repo
      });
    });
  });

  describe('commit sha case', () => {
    const body = 'body';
    const sha = 'sha';

    beforeEach(() => {
      createPrComment({ body, sha });
    });

    it('should call listPullRequestsAssociatedWithCommit with correct params', () => {
      expect(octokit.repos.listPullRequestsAssociatedWithCommit).toHaveBeenCalledWith({
        commit_sha: 'sha',
        ...context.repo
      });
    });

    it('should call createComment with correct params', () => {
      expect(octokit.issues.createComment).toHaveBeenCalledWith({
        body,
        issue_number: 112233,
        ...context.repo
      });
    });
  });

  describe('update comment case', () => {
    const body = 'body';
    const login = 'login';

    beforeEach(() => {
      createPrComment({ body, login });
    });

    it('should not call createComment with correct params', () => {
      expect(octokit.issues.createComment).not.toHaveBeenCalled();
    });

    it('should call listComments with correct params', () => {
      expect(octokit.issues.listComments).toHaveBeenCalledWith({
        issue_number: 123,
        ...context.repo
      });
    });

    it('should call updateComment with correct params', () => {
      expect(octokit.issues.updateComment).toHaveBeenCalledWith({
        comment_id: 12345,
        body,
        ...context.repo
      });
    });
  });
});
