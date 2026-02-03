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

// Mock getRequiredCodeOwnersEntries
mock.module('../../src/utils/get-core-member-logins', () => ({
  getRequiredCodeOwnersEntries: mock(() => Promise.resolve([])),
  getCoreMemberLogins: mock(() => Promise.resolve([]))
}));

const { areReviewersRequired } = await import('../../src/helpers/are-reviewers-required');
const { getRequiredCodeOwnersEntries } = await import('../../src/utils/get-core-member-logins');

describe('AreReviewersRequired', () => {
  beforeEach(() => {
    (getRequiredCodeOwnersEntries as unknown as Mock<any>).mockResolvedValue([{ owners: ['@ExpediaGroup/team1', '@ExpediaGroup/team2'] }]);
  });

  it('should return true when all teams are required reviewers', async () => {
    const result = await areReviewersRequired({ teams: '@ExpediaGroup/team1\n@ExpediaGroup/team2' });
    expect(result).toBe(true);
  });

  it('should return false when not all teams are required reviewers', async () => {
    const result = await areReviewersRequired({ teams: '@ExpediaGroup/team1\n@ExpediaGroup/team3' });
    expect(result).toBe(false);
  });
});
