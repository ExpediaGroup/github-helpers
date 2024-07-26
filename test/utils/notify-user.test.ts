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
import axios from 'axios';
import { context } from '@actions/github';
import { notifyUser } from '../../src/utils/notify-user';
import { octokit } from '../../src/octokit';
import {createPrComment} from "../../src/helpers/create-pr-comment";

jest.mock('../../src/helpers/create-pr-comment');
jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: { get: jest.fn() },
      users: { getByUsername: jest.fn() }
    }
  }))
}));
jest.mock('axios');

const login = 'octocat';
const assigneeEmail = 'assignee@github.com';
const title = 'title';
const html_url = 'url';
(octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
  data: { title, html_url }
}));
(axios.post as jest.Mock).mockResolvedValue({ data: 'request succeeded' });

describe('notifyUser', () => {
  const pull_number = 123;
  const slack_webhook_url = 'https://hooks.slack.com/workflows/1234567890';
  beforeEach(async () => {
    (octokit.users.getByUsername as unknown as Mocktokit).mockImplementation(async () => ({
      data: {
        email: assigneeEmail
      }
    }));
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
  const comment_body = "Your PR is first in the queue";

  beforeEach(async () => {
    (octokit.users.getByUsername as unknown as Mocktokit).mockImplementation(async () => ({
      data: {
        email: null
      }
    }));

    await notifyUser({ login, pull_number, slack_webhook_url, comment_body});
  });

  it('should add a PR comment when email is not found', () => {
    expect(octokit.users.getByUsername).toHaveBeenCalledWith({ username: login });
    expect(createPrComment).toHaveBeenCalledWith({ body: comment_body });
    expect(axios.post).not.toHaveBeenCalled();
  });
});
