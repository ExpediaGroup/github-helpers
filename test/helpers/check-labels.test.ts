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

import { checkLabels } from '../../src/helpers/check-labels';
import { octokit } from '../../src/octokit';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({ rest: { pulls: { get: jest.fn() } } }))
}));

describe('checkLabels', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not pass is PR has different labels', async () => {
    const contains_all_labels = 'test-label1, test label 2';

    (octokit.pulls.get as any).mockImplementation(async () => ({
      data: {
        labels: [{ name: 'not matching label' }]
      }
    }));
    const result = await checkLabels({ pull_number: '123', contains_all_labels });
    expect(result).toBe(false);
  });

  it('should pass if PR has all labels', async () => {
    const contains_all_labels = 'test-label1, test label 2';

    (octokit.pulls.get as any).mockImplementation(async () => ({
      data: {
        labels: [{ name: 'not matching label' }, { name: 'test-label1' }, { name: 'test label 2' }]
      }
    }));
    const result = await checkLabels({ pull_number: '123', contains_all_labels });
    expect(result).toBe(true);
  });
});
