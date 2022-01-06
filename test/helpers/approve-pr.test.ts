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

import { approvePr } from '../../src/helpers/approve-pr';
import { context } from '@actions/github';
import { octokit } from '../../src/octokit';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({ rest: { pulls: { createReview: jest.fn() } } }))
}));

describe('approvePr', () => {
  beforeEach(() => {
    approvePr();
  });

  it('should call createReview with correct params', () => {
    expect(octokit.pulls.createReview).toHaveBeenCalledWith({
      pull_number: 123,
      body: 'Approved by bot',
      event: 'APPROVE',
      ...context.repo
    });
  });
});
