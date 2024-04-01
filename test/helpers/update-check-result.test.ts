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
import { updateCheckResult } from '../../src/helpers/update-check-result';
import { octokit } from '../../src/octokit';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      checks: {
        listForRef: jest.fn(() => ({ data: { check_runs: [{ id: 123 }] } })),
        update: jest.fn()
      }
    }
  }))
}));

describe('updateCheckResult', () => {
  beforeEach(async () => {
    await updateCheckResult({ context: 'My PR Check', sha: 'sha', state: 'success' });
  });

  it('should call checks.update with correct params', () => {
    expect(octokit.checks.listForRef).toHaveBeenCalledWith({
      ref: 'sha',
      check_name: 'My PR Check',
      ...context.repo
    });
  });

  it('should call checks.update with correct params', () => {
    expect(octokit.checks.update).toHaveBeenCalledWith({
      check_run_id: 123,
      conclusion: 'success',
      output: {
        title: 'Check updated to success',
        summary: 'Check updated via update-check-result helper'
      },
      ...context.repo
    });
  });
});
