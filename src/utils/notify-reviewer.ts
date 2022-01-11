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

interface NotifyReviewer {
  login: string;
  pull_number: number;
  slack_webhook_url: string;
}

export const notifyReviewer = async ({ login, pull_number, slack_webhook_url }: NotifyReviewer) => {
  const {
    data: { email }
  } = await octokit.users.getByUsername({ username: login });
  if (!email) {
    core.info(`No github email found for user ${login}. Ensure you have set your email to be publicly visible on your Github profile.`);
    return;
  }
  const {
    data: { title, html_url }
  } = await octokit.pulls.get({ pull_number, ...context.repo });

  const { data } = await axios.post(slack_webhook_url, {
    assignee: email,
    title,
    html_url,
    repo: context.repo.repo
  });

  return data;
};
