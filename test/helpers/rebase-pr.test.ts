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
import { rebasePr } from '../../src/helpers/rebase-pr';
import { rebasePullRequest } from 'github-rebase';

jest.mock('@actions/core');
jest.mock('github-rebase');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => 'octokit')
}));

describe('rebasePr', () => {
  beforeEach(() => {
    rebasePr({ pull_number: '123', github_token: 'token' });
  });

  it('should call rebasePullRequest with correct params', () => {
    expect(rebasePullRequest).toHaveBeenCalledWith({
      pullRequestNumber: 123,
      octokit: 'octokit',
      ...context.repo
    });
  });
});
