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

import { addPrStaleLabel } from '../../src/helpers/add-pr-stale-label';
import { context } from '@actions/github';
import { octokit } from '../../src/octokit';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({ rest: { issues: { addLabels: jest.fn() } } }))
}));

describe('addPrStaleLabel', () => {
  describe('Late Review', () => {
    const prs = "0001";
    const owner = context.owner;
    const repo = context.repo;

    beforeEach(async () => {
      // prs, owner, repo_name
      await addPrStaleLabel({
        prs,
        owner,
        repo
      });
    });

    it('should call getCoreMemberLogins with correct params', () => {
      expect(getCoreMemberLogins).toHaveBeenCalledWith(123, ['team1', 'team2']);
    });

    it('should add core approved label to the pr', () => {
      expect(octokit.issues.addLabels).toHaveBeenCalledWith({
        labels: [CORE_APPROVED_PR_LABEL],
        issue_number: 123,
        ...context.repo
      });
    });
  });
});
