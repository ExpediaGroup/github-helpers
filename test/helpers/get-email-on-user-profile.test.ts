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

import { describe, it, expect, beforeEach, Mock, mock } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

const { getEmailOnUserProfile } = await import('../../src/helpers/get-email-on-user-profile');
const { octokit } = await import('../../src/octokit');
const core = await import('@actions/core');

(octokit.users.getByUsername as unknown as Mock<any>).mockImplementation(async () => ({
  data: { email: 'example@github.com' }
}));

describe('getEmailOnUserProfile', () => {
  beforeEach(() => {
    mock.clearAllMocks()
  });
  it('should retrieve user email', async () => {
    const result = await getEmailOnUserProfile({ login: 'example' });
    expect(result).toBe('example@github.com');
  });

  it('should fail if user has no email on their profile', async () => {
    (octokit.users.getByUsername as unknown as Mock<any>).mockImplementationOnce(() => ({ data: { email: null } }));
    const result = await getEmailOnUserProfile({ login: 'example' });
    expect(core.setFailed).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should retrieve user email that matches regex pattern', async () => {
    const result = await getEmailOnUserProfile({ login: 'example', pattern: '@github.com' });
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(result).toBe('example@github.com');
  });

  it('should fail if resulting email does not match regex pattern', async () => {
    const result = await getEmailOnUserProfile({ login: 'example', pattern: '@expediagroup.com' });
    expect(core.setFailed).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
