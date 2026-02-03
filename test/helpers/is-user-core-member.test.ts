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

// Mock getCoreMemberLogins
mock.module('../../src/utils/get-core-member-logins', () => ({
  getCoreMemberLogins: mock(() => Promise.resolve([]))
}));

const { isUserCoreMember } = await import('../../src/helpers/is-user-core-member');
const { getCoreMemberLogins } = await import('../../src/utils/get-core-member-logins');

describe('isUserCoreMember', () => {
  const login = 'octocat';
  const pull_number = '123';

  beforeEach(() => {
    mock.clearAllMocks();
  });

  it('should call isUserCoreMember with correct params and find user as core member', async () => {
    (getCoreMemberLogins as unknown as Mock<any>).mockResolvedValue(['octocat', 'admin']);

    const response = await isUserCoreMember({ login, pull_number });

    expect(getCoreMemberLogins).toHaveBeenCalledWith({ pull_number: Number(pull_number) });
    expect(response).toBe(true);
  });

  it('should call isUserCoreMember with correct params and find user as core member when CODEOWNERS overrides are specified', async () => {
    (getCoreMemberLogins as unknown as Mock<any>).mockResolvedValue(['octocat', 'admin']);

    const response = await isUserCoreMember({ login, pull_number, codeowners_overrides: '/foo @octocat' });

    expect(getCoreMemberLogins).toHaveBeenCalledWith({ pull_number: Number(pull_number), codeowners_overrides: '/foo @octocat' });
    expect(response).toBe(true);
  });

  it('should call isUserCoreMember with correct params and find user as core member for context actor', async () => {
    (getCoreMemberLogins as unknown as Mock<any>).mockResolvedValue(['admin']);

    const response = await isUserCoreMember({ pull_number });

    expect(getCoreMemberLogins).toHaveBeenCalledWith({ pull_number: Number(pull_number) });
    expect(response).toBe(true);
  });

  it('should call isUserCoreMember with correct params and find user not as core member', async () => {
    (getCoreMemberLogins as unknown as Mock<any>).mockResolvedValue(['admin']);

    const response = await isUserCoreMember({ login, pull_number });

    expect(getCoreMemberLogins).toHaveBeenCalledWith({ pull_number: Number(pull_number) });
    expect(response).toBe(false);
  });
});
