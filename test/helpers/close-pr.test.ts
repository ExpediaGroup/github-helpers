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

const { closePr } = await import('../../src/helpers/close-pr');
const { octokit } = await import('../../src/octokit');
const { context } = await import('@actions/github');


describe('closePr', () => {
  beforeEach(() => {
    mock.clearAllMocks()
  });
  describe('without comment in the same PR', () => {
    beforeEach(() => {
      closePr();
    });

    it('should not call createPrComment', () => {
      expect(octokit.issues.createComment).not.toHaveBeenCalled();
    });

    it('should call pulls.update with correct params', () => {
      expect(octokit.pulls.update).toHaveBeenCalledWith({
        pull_number: 123,
        state: 'closed',
        ...context.repo
      });
    });
  });

  describe('without comment in different PR', () => {
    beforeEach(() => {
      closePr({ pull_number: '456' });
    });

    it('should not call createPrComment', () => {
      expect(octokit.issues.createComment).not.toHaveBeenCalled();
    });

    it('should call pulls.update with correct params', () => {
      expect(octokit.pulls.update).toHaveBeenCalledWith({
        pull_number: 456,
        state: 'closed',
        ...context.repo
      });
    });
  });

  describe('without comment in different repo', () => {
    beforeEach(() => {
      closePr({ repo_name: 'another-repo', repo_owner_name: 'another-owner', pull_number: '456' });
    });

    it('should not call createPrComment', () => {
      expect(octokit.issues.createComment).not.toHaveBeenCalled();
    });

    it('should call pulls.update with correct params', () => {
      expect(octokit.pulls.update).toHaveBeenCalledWith({
        pull_number: 456,
        state: 'closed',
        repo: 'another-repo',
        owner: 'another-owner'
      });
    });
  });

  describe('with comment in the same PR', () => {
    const body = 'some comment';

    beforeEach(() => {
      closePr({ body });
    });

    it('should call createPrComment with correct params', () => {
      // createPrComment is now a real function call
      // Verify the underlying octokit call happened instead
      expect(octokit.issues.createComment).toHaveBeenCalledWith({
        body,
        issue_number: 123,
        ...context.repo
      });
    });

    it('should call pulls.update with correct params', () => {
      expect(octokit.pulls.update).toHaveBeenCalledWith({
        pull_number: 123,
        state: 'closed',
        ...context.repo
      });
    });
  });

  describe('with comment in different PR', () => {
    const body = 'some comment';

    beforeEach(() => {
      closePr({ body, pull_number: '456' });
    });

    it('should call createPrComment', () => {
      // createPrComment is now a real function call
      // Verify the underlying octokit call happened instead
      expect(octokit.issues.createComment).toHaveBeenCalledWith({
        body,
        issue_number: 456,
        ...context.repo
      });
    });

    it('should call pulls.update with correct params', () => {
      expect(octokit.pulls.update).toHaveBeenCalledWith({
        pull_number: 456,
        state: 'closed',
        ...context.repo
      });
    });
  });

  describe('with comment in different repo', () => {
    const body = 'some comment';

    beforeEach(() => {
      closePr({ body, repo_name: 'another-repo', repo_owner_name: 'another-owner', pull_number: '456' });
    });

    it('should call createPrComment', () => {
      // createPrComment is now a real function call
      // Verify the underlying octokit call happened instead
      expect(octokit.issues.createComment).toHaveBeenCalledWith({
        body,
        issue_number: 456,
        repo: 'another-repo',
        owner: 'another-owner'
      });
    });

    it('should call pulls.update with correct params', () => {
      expect(octokit.pulls.update).toHaveBeenCalledWith({
        pull_number: 456,
        state: 'closed',
        repo: 'another-repo',
        owner: 'another-owner'
      });
    });
  });
});
