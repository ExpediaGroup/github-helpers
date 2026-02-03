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

const { context } = await import('@actions/github');
const { octokit } = await import('../../src/octokit');
const { removeLabel } = await import('../../src/helpers/remove-label');

describe('removeLabel', () => {
  const label = 'Needs a11y review';

  beforeEach(() => {
    (octokit.issues.removeLabel as unknown as Mock<any>).mockImplementation(async () => ({ data: 'label removed!' }));
    removeLabel({ label });
  });

  it('should call addLabels with correct params', () => {
    expect(octokit.issues.removeLabel).toHaveBeenCalledWith({
      name: label,
      issue_number: 123,
      ...context.repo
    });
  });
});
