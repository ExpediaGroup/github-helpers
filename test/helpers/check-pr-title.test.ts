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

import { describe, it, expect, Mock } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

const { checkPrTitle } = await import('../../src/helpers/check-pr-title');
const { octokit } = await import('../../src/octokit');

describe('checkPrTitle', () => {
  it('should pass as the PR title conforms to the regex', async () => {
    (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
      data: {
        id: 1,
        number: 123,
        state: 'open',
        title: 'feat: added feature to project'
      }
    }));

    const result = await checkPrTitle({});

    expect(result).toBe(true);
  });

  it('should fail as the PR title does not conform to the regex', async () => {
    (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
      data: {
        id: 1,
        number: 123,
        state: 'open',
        title: 'this title will fail'
      }
    }));

    const result = await checkPrTitle({});

    expect(result).toBe(false);
  });
});
