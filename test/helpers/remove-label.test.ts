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

import { removeLabel } from '../../src/helpers/remove-label';
import { octokit } from '../../src/octokit';
import { context } from '@actions/github';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({ rest: { issues: { removeLabel: jest.fn() } } }))
}));
(octokit.issues.removeLabel as any).mockImplementation(async () => 'label removed!');

describe('removeLabel', () => {
  const label = 'Needs a11y review';
  const pull_number = '123';

  beforeEach(() => {
    removeLabel({ label, pull_number });
  });

  it('should call addLabels with correct params', () => {
    expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
      name: label,
      issue_number: 123,
      ...context.repo
    });
  });
});
