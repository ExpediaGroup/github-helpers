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

import { context } from '@actions/github';
import { closePr } from '../../src/helpers/close-pr';
import { octokit } from '../../src/octokit';
import { createPrComment } from '../../src/helpers/create-pr-comment';

jest.mock('../../src/helpers/create-pr-comment');
jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: { update: jest.fn() }
    }
  }))
}));

describe('closePr', () => {
  describe('without comment in the same PR', () => {
    beforeEach(() => {
      closePr();
    });

    it('should not call createPrComment', () => {
      expect(createPrComment).not.toHaveBeenCalled();
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
      expect(createPrComment).not.toHaveBeenCalled();
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
      expect(createPrComment).not.toHaveBeenCalled();
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
      expect(createPrComment).toHaveBeenCalledWith({ body });
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
      expect(createPrComment).toHaveBeenCalledWith({ body, pull_number: '456' });
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
      expect(createPrComment).toHaveBeenCalledWith({
        body,
        repo_name: 'another-repo',
        repo_owner_name: 'another-owner',
        pull_number: '456'
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
