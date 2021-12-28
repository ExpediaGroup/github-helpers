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

import { addLabels } from '../../src/helpers/add-labels';
import { context } from '@actions/github';
import { octokit } from '../../src/octokit';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({ rest: { issues: { addLabels: jest.fn() } } }))
}));

describe('addLabels', () => {
  const labels = 'Needs a11y review\nExempt 👻';

  beforeEach(() => {
    addLabels({ labels });
  });

  it('should call addLabels with correct params', () => {
    expect(octokit.issues.addLabels).toHaveBeenCalledWith({
      labels: labels.split('\n'),
      issue_number: 123,
      ...context.repo
    });
  });
});
