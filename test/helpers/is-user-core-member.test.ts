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

import { isUserCoreMember } from '../../src/helpers/is-user-core-member';
import { getCoreMemberLogins } from '../../src/utils/get-core-member-logins';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 }, actor: 'admin' }
}));
jest.mock('../../src/utils/get-core-member-logins', () => ({
  getCoreMemberLogins: jest.fn()
}));

describe('isUserCoreMember', () => {
  const login = 'octocat';
  const pull_number = '123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call isUserCoreMember with correct params and find user as core member', async () => {
    (getCoreMemberLogins as jest.Mock).mockResolvedValue(['octocat', 'admin']);

    const response = await isUserCoreMember({ login, pull_number });

    expect(getCoreMemberLogins).toHaveBeenCalledWith(Number(pull_number));
    expect(response).toBe(true);
  });

  it('should call isUserCoreMember with correct params and find user as core member for context actor', async () => {
    (getCoreMemberLogins as jest.Mock).mockResolvedValue(['admin']);

    const response = await isUserCoreMember({ pull_number });

    expect(getCoreMemberLogins).toHaveBeenCalledWith(Number(pull_number));
    expect(response).toBe(true);
  });

  it('should call isUserCoreMember with correct params and find user not as core member', async () => {
    (getCoreMemberLogins as jest.Mock).mockResolvedValue(['admin']);

    const response = await isUserCoreMember({ login, pull_number });

    expect(getCoreMemberLogins).toHaveBeenCalledWith(Number(pull_number));
    expect(response).toBe(false);
  });
});
