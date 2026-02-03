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

import { describe, it, expect, beforeEach, mock, Mock } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks({ ref: 'refs/heads/source' });

// Create mocks for simpleGit
const mockGit = {
  diff: mock(() => ''),
  fetch: mock(() => 'new fetch value'),
  checkoutLocalBranch: mock(() => {}),
  add: mock(() => {}),
  commit: mock(() => {}),
  push: mock(() => {}),
  addConfig: mock(() => {})
};

const simpleGitMock = mock(() => mockGit) as any;
simpleGitMock.__mockGitInstance = mockGit;

mock.module('simple-git', () => ({
  default: simpleGitMock,
  simpleGit: simpleGitMock
}));

const { createPr } = await import('../../src/helpers/create-pr');
const { octokit } = await import('../../src/octokit');
const { context } = await import('@actions/github');
const simpleGit = (await import('simple-git')).default;

(octokit.repos.get as unknown as Mock<any>).mockImplementation(async () => ({
  data: {
    default_branch: 'default branch'
  }
}));
(octokit.pulls.create as unknown as Mock<any>).mockImplementation(async () => ({
  data: {
    title: 'title',
    number: 100
  }
}));

describe('createPr', () => {
  beforeEach(() => {
    mock.clearAllMocks();
  });
  const title = 'title';
  const body = 'body';
  const commit_message = 'commit message';

  it('should call repos get with correct params', async () => {
    await createPr({
      title,
      body,
      commit_message
    });
    expect(octokit.repos.get).toHaveBeenCalledWith({ ...context.repo });
  });

  it('should call repos merge with correct params', async () => {
    await createPr({
      title,
      body,
      commit_message
    });
    expect(octokit.repos.merge).toHaveBeenCalledWith({
      base: 'source',
      head: 'default branch',
      ...context.repo
    });
  });

  it('should call create with correct params', async () => {
    await createPr({
      title,
      body,
      commit_message
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
      body,
      commit_message
    });
    expect(result).toBe(100);
  });

  it('should return the full response object', async () => {
    const result = await createPr({
      title,
      body,
      commit_message,
      return_full_payload: 'true'
    });
    expect(result).toMatchObject({ title, number: 100 });
  });

  it('should create pull from specified head', async () => {
    const head = 'feature/abc';
    await createPr({
      title,
      body,
      commit_message,
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

  it('should create pull onto specified base', async () => {
    const base = '1.x';
    await createPr({
      title,
      body,
      commit_message,
      base
    });
    expect(octokit.pulls.create).toHaveBeenCalledWith({
      title,
      head: 'source',
      base,
      body,
      maintainer_can_modify: true,
      draft: undefined,
      issue: undefined,
      ...context.repo
    });
    // Since the base was provided, the repos PR should not be called.
    expect(octokit.repos.get).not.toHaveBeenCalled();
  });

  it('should create a branch if branch_name is given', async () => {
    const branch_name = 'feature/abc';
    const commit_message = 'commit message';

    await createPr({
      title,
      body,
      commit_message,
      branch_name
    });

    const git = (simpleGit as any).__mockGitInstance;

    expect(git.addConfig).toHaveBeenCalledWith('user.name', 'github-actions[bot]');
    expect(git.addConfig).toHaveBeenCalledWith('user.email', 'github-actions[bot]@users.noreply.github.com');
    expect(git.checkoutLocalBranch).toHaveBeenCalledWith(branch_name);
    expect(git.add).toHaveBeenCalledWith('.');
    expect(git.commit).toHaveBeenCalledWith(commit_message);
    expect(git.push).toHaveBeenCalledWith('origin', branch_name);
  });
});
