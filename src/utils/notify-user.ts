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

import * as core from '@actions/core';
import axios from 'axios';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { createPrComment } from '../helpers/create-pr-comment';

interface NotifyUser {
  login: string;
  pull_number: number;
  slack_webhook_url: string;
  comment_body?: string;
}

export const notifyUser = async ({ login, pull_number, slack_webhook_url, comment_body }: NotifyUser) => {
  core.info(`Notifying user ${login}...`);
  const {
    data: { email }
  } = await octokit.users.getByUsername({ username: login });
  if (!email && comment_body) {
    return await createPrComment({
      body: comment_body
    });
  }
  const {
    data: { title, html_url }
  } = await octokit.pulls.get({ pull_number, ...context.repo });

  try {
    await axios.post(slack_webhook_url, {
      assignee: email,
      title,
      html_url,
      repo: context.repo.repo
    });
  } catch (error) {
    core.warning('User notification failed');
    core.warning(error as Error);
  }
};
