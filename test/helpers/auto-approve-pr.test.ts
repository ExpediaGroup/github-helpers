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

import { autoApprovePr } from '../../src/helpers/auto-approve-pr';
import { octokit } from '../../src/octokit';
import { context } from '@actions/github';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({ rest: { pulls: { createReview: jest.fn() } } }))
}));

describe('autoApprovePr', () => {
  const auto_approved_user = 'renovate';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('non renovate user', () => {
    const login = 'user';

    beforeEach(() => {
      autoApprovePr({ pull_number: '123', login, auto_approved_user });
    });

    it('should not approve', () => {
      expect(octokit.pulls.createReview).toBeCalledTimes(0);
    });
  });

  describe('renovate pr', () => {
    const login = 'renovate';
    const pull_number = Number(123);

    beforeEach(() => {
      autoApprovePr({ pull_number: '123', login, auto_approved_user });
    });

    it('should approve', () => {
      expect(octokit.pulls.createReview).toHaveBeenCalledWith({
        pull_number,
        body: 'Approved by bot',
        event: 'APPROVE',
        ...context.repo
      });
    });
  });
});
