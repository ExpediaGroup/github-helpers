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

import { getEmailOnUserProfile } from '../../src/helpers/get-email-on-user-profile';
import * as core from '@actions/core';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      users: {
        getByUsername: jest.fn(() => ({ data: { email: 'example@github.com' } }))
      }
    }
  }))
}));

describe('getEmailOnUserProfile', () => {
  it('should retrieve user email', async () => {
    const result = await getEmailOnUserProfile({ login: 'example' });
    expect(result).toBe('example@github.com');
  });

  it('should retrieve user email matches regex pattern', async () => {
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
