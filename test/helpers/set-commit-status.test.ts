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

import { octokit } from '../../src/octokit';
import { setCommitStatus } from '../../src/helpers/set-commit-status';
import { context as githubContext } from '@actions/github';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({ rest: { repos: { createCommitStatus: jest.fn() } } }))
}));

describe('setCommitStatus', () => {
  const sha = 'sha';
  const state = 'success';
  const description = 'desc';
  const target_url = 'url';

  describe('single context', () => {
    const context = 'context';

    beforeEach(() => {
      setCommitStatus({
        sha,
        context,
        state,
        description,
        target_url
      });
    });

    it('should call createCommitStatus with correct params', () => {
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        sha,
        context,
        state,
        description,
        target_url,
        ...githubContext.repo
      });
    });
  });

  describe('multiple contexts', () => {
    const context = 'context1\ncontext2';

    beforeEach(() => {
      setCommitStatus({
        sha,
        context,
        state,
        description,
        target_url
      });
    });

    it.each(['context1', 'context2'])('should call createCommitStatus with correct params', context => {
      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        sha,
        context,
        state,
        description,
        target_url,
        ...githubContext.repo
      });
    });
  });
});
