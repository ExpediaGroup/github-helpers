/*
Copyright 2023 Expedia, Inc.
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
import { octokit } from '../../src/octokit';
import { getMergeBase } from '../../src/helpers/get-merge-base';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({ rest: { pulls: { get: jest.fn() } } }))
}));

describe('getMergeBase', () => {
  it('should return merge base commit SHA', async () => {
    (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
      data: {
        base: {
          sha: 'merge_base_sha'
        }
      }
    }));

    const result = await getMergeBase();

    expect(result).toBe('merge_base_sha');
  });

  it('should handle errors', async () => {
    (octokit.pulls.get as unknown as jest.Mock).mockRejectedValue(new Error('API error'));

    const result = await getMergeBase();

    expect(result).toBeNull();
  });
});
