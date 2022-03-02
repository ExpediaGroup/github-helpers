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

import { Mocktokit } from '../types';
import { context } from '@actions/github';
import { createPr } from '../../src/helpers/create-pr';
import { octokit } from '../../src/octokit';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, ref: 'refs/heads/source' },
  getOctokit: jest.fn(() => ({
    rest: {
      repos: { get: jest.fn() },
      pulls: { create: jest.fn() }
    }
  }))
}));

(octokit.repos.get as unknown as Mocktokit).mockImplementation(async () => ({
  data: {
    default_branch: 'default branch'
  }
}));
(octokit.pulls.create as unknown as Mocktokit).mockImplementation(async () => ({
  data: {
    number: 100
  }
}));

describe('createPr', () => {
  const title = 'title';
  const body = 'body';

  it('should call repos get with correct params', async () => {
    await createPr({
      title,
      body
    });
    expect(octokit.repos.get).toHaveBeenCalledWith({ ...context.repo });
  });

  it('should call create with correct params', async () => {
    await createPr({
      title,
      body
    });
    expect(octokit.pulls.create).toHaveBeenCalledWith({
      title,
      head: 'source',
      base: 'default branch',
      body,
      maintainer_can_modify: true,
      draft: undefined,
      issue: undefined,
      ...context.repo
    });
  });

  it('should return the pull number', async () => {
    const result = await createPr({
      title,
      body
    });
    expect(result).toBe(100);
  });

  it('should create pull from specified head', async () => {
    const head = 'feature/abc';
    await createPr({
      title,
      body,
      head
    });
    expect(octokit.pulls.create).toHaveBeenCalledWith({
      title,
      head,
      base: 'default branch',
      body,
      maintainer_can_modify: true,
      draft: undefined,
      issue: undefined,
      ...context.repo
    });
  });
});
