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

// Mock axios
const axiosPostMock = mock(() => Promise.resolve({ data: 'request succeeded' }));
mock.module('axios', () => ({
  default: {
    post: axiosPostMock
  }
}));

const { notifyUser } = await import('../../src/utils/notify-user');
const { octokit } = await import('../../src/octokit');
const { context } = await import('@actions/github');
const core = await import('@actions/core');
const axios = (await import('axios')).default;

const login = 'octocat';
const assigneeEmail = 'assignee@github.com';
const title = 'title';
const html_url = 'url';
(octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
  data: { title, html_url }
}));
(axios.post as unknown as Mock<any>).mockResolvedValue({ data: 'request succeeded' });
(octokit.users.getByUsername as unknown as Mock<any>).mockImplementation(async () => ({
  data: {
    email: assigneeEmail
  }
}));

describe('notifyUser', () => {
  const pull_number = 123;
  const slack_webhook_url = 'https://hooks.slack.com/workflows/1234567890';
  beforeEach(async () => {
    mock.clearAllMocks();
    await notifyUser({ login, pull_number, slack_webhook_url });
  });

  it('should call getByUsername with correct params', () => {
    expect(octokit.users.getByUsername).toHaveBeenCalledWith({ username: login });
  });

  it('should call pulls with correct params', () => {
    expect(octokit.pulls.get).toHaveBeenCalledWith({ pull_number: 123, ...context.repo });
  });

  it('should call axios with correct params', () => {
    expect(axios.post).toHaveBeenCalledWith(slack_webhook_url, {
      assignee: assigneeEmail,
      title,
      html_url,
      repo: context.repo.repo
    });
  });
});

describe('notifyUser with a PR comment', () => {
  const pull_number = 123;
  const slack_webhook_url = 'https://hooks.slack.com/workflows/1234567890';

  beforeEach(async () => {
    mock.clearAllMocks();
    (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
      data: { title, html_url }
    }));
    (axios.post as unknown as Mock<any>).mockResolvedValue({ data: 'request succeeded' });
    (octokit.users.getByUsername as unknown as Mock<any>).mockImplementation(async () => ({
      data: {
        email: null
      }
    }));

    await notifyUser({ login, pull_number, slack_webhook_url });
  });

  it('should do nothing when email is not found', () => {
    expect(octokit.users.getByUsername).toHaveBeenCalledWith({ username: login });
    expect(axios.post).not.toHaveBeenCalled();
  });
});

describe('notifyUser should fail if slack webhook input is invalid', () => {
  const pull_number = 123;
  const slack_webhook_url = 'https://hooks.slack.com/workflows/1234567890';

  beforeEach(async () => {
    mock.restore();
    // Clear call history for mocked functions
    (axios.post as unknown as Mock<any>).mockClear();
    (octokit.users.getByUsername as unknown as Mock<any>).mockClear();
    (octokit.pulls.get as unknown as Mock<any>).mockClear();
    (core.setFailed as unknown as Mock<any>).mockClear();
    // Re-establish base mocks
    (octokit.pulls.get as unknown as Mock<any>).mockImplementation(async () => ({
      data: { title, html_url }
    }));
    (axios.post as unknown as Mock<any>).mockResolvedValue({ data: 'request succeeded' });
    (octokit.users.getByUsername as unknown as Mock<any>).mockImplementation(async () => ({
      data: {
        email: null
      }
    }));

    await notifyUser({ login: '', pull_number, slack_webhook_url });
  });

  it('should fail the job', () => {
    expect(core.setFailed).toHaveBeenCalled();
  });
});
