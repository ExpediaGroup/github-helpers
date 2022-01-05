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

import { context } from '@actions/github';
import { createPr } from '../../src/helpers/create-pr';
import { octokit } from '../../src/octokit';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, ref: 'refs/heads/source' },
  getOctokit: jest.fn(() => ({ rest: { pulls: { create: jest.fn() } } }))
}));

describe('createPr', () => {
  const title = 'title';
  const body = 'body';

  beforeEach(() => {
    createPr({
      title,
      body
    });
  });

  it('should call create with correct params', () => {
    expect(octokit.pulls.create).toHaveBeenCalledWith({
      title,
      head: 'source',
      base: 'HEAD',
      body,
      maintainer_can_modify: true,
      draft: false,
      issue: undefined,
      ...context.repo
    });
  });
});
