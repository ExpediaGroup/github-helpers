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
import { closeStalePullRequests } from '../../src/helpers/close-stale-pull-requests';
import { octokit } from '../../src/octokit';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: {
        list: jest.fn(),
        update: jest.fn()
      }
    }
  }))
}));
(octokit.pulls.list as unknown as Mocktokit).mockImplementation(async () => ({
  data: [{ number: 123, updated_at: '2022-06-18T00:00:00.000' }]
}));

describe('closeStalePullRequests', () => {
  beforeEach(() => {
    closeStalePullRequests({ threshold: '5' });
  });

  it('should pass', () => {
    expect(octokit.pulls.update).toHaveBeenCalledWith({
      pull_number: 123,
      state: 'closed',
      ...context.repo
    });
  });
});
