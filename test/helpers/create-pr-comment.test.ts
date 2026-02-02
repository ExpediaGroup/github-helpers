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

import { describe, it, expect, beforeEach, Mock, mock } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

const { createPrComment } = await import('../../src/helpers/create-pr-comment');
const { octokit } = await import('../../src/octokit');
const { context } = await import('@actions/github');


(octokit.issues.listComments as unknown as Mock<any>).mockImplementation(async () => ({
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
(octokit.repos.listPullRequestsAssociatedWithCommit as unknown as Mock<any>).mockImplementation(async () => ({
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
  beforeEach(() => {
    mock.clearAllMocks()
  });

  describe('create comment in same PR', () => {
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

  describe('create comment in other repo', () => {
    const body = 'body';

    beforeEach(() => {
      createPrComment({ body, repo_name: 'another-repo', repo_owner_name: 'another-owner', pull_number: '456' });
    });

    it('should call createComment with correct params', () => {
      expect(octokit.issues.createComment).toHaveBeenCalledWith({
        body,
        issue_number: 456,
        repo: 'another-repo',
        owner: 'another-owner'
      });
    });
  });

  describe('create comment case - sha supplied', () => {
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

    it('should not call updateComment', () => {
      expect(octokit.issues.updateComment).not.toHaveBeenCalled();
    });
  });

  describe('create comment case - login supplied', () => {
    const body = 'body';
    const login = 'login-with-no-matching-comments';

    beforeEach(() => {
      createPrComment({ body, login });
    });

    it('should call createComment with correct params', () => {
      expect(octokit.issues.createComment).toHaveBeenCalledWith({
        body,
        issue_number: 123,
        ...context.repo
      });
    });

    it('should call listComments with correct params', () => {
      expect(octokit.issues.listComments).toHaveBeenCalledWith({
        issue_number: 123,
        ...context.repo
      });
    });

    it('should not call updateComment', () => {
      expect(octokit.issues.updateComment).not.toHaveBeenCalled();
    });
  });

  describe('update comment case - sha and login supplied', () => {
    const body = 'body';
    const sha = 'sha';
    const login = 'login';

    beforeEach(() => {
      createPrComment({ body, sha, login });
    });

    it('should call listPullRequestsAssociatedWithCommit with correct params', () => {
      expect(octokit.repos.listPullRequestsAssociatedWithCommit).toHaveBeenCalledWith({
        commit_sha: 'sha',
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

    it('should call listComments with correct params', () => {
      expect(octokit.issues.listComments).toHaveBeenCalledWith({
        issue_number: 123,
        ...context.repo
      });
    });

    it('should not call createComment', () => {
      expect(octokit.issues.createComment).not.toHaveBeenCalled();
    });
  });

  describe('update comment case - login supplied', () => {
    const body = 'body';
    const login = 'login';

    beforeEach(() => {
      createPrComment({ body, login });
    });

    it('should call updateComment with correct params', () => {
      expect(octokit.issues.updateComment).toHaveBeenCalledWith({
        comment_id: 12345,
        body,
        ...context.repo
      });
    });

    it('should call listComments with correct params', () => {
      expect(octokit.issues.listComments).toHaveBeenCalledWith({
        issue_number: 123,
        ...context.repo
      });
    });

    it('should not call createComment', () => {
      expect(octokit.issues.createComment).not.toHaveBeenCalled();
    });
  });
});
