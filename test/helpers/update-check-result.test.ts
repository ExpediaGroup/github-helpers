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

import { describe, it, expect, beforeEach, Mock } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

const { updateCheckResult } = await import('../../src/helpers/update-check-result');
const { octokit } = await import('../../src/octokit');
const { context } = await import('@actions/github');

// Mock checks.listForRef to return check run with id 123
(octokit.checks.listForRef as unknown as Mock<any>).mockImplementation(async () => ({
  data: {
    check_runs: [{ id: 123, name: 'My PR Check' }]
  }
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
