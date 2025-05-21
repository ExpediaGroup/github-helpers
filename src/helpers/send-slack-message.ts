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

import { HelperInputs } from '../types/generated';
import { automatedPr, ActionInput } from '../utils/slack-actions';
import { ChatPostMessageResponse, WebClient } from '@slack/web-api';
import fs from 'fs';

type TemplateDir = {
  [key: string]: {
    dir: string;
    action: (input: ActionInput) => Promise<ChatPostMessageResponse>;
  };
};

const TEMPLATES: TemplateDir = {
  'automated-pr': {
    dir: '../templates/json/automated-pr.json',
    action: automatedPr
  }
};

export class SlackBotWebhook extends HelperInputs {
  slack_token = '';
  message_template = '';
  declare channel?: string;
  declare message_tag_id?: string;
  declare message_tag_name?: string;
  declare bttn_link?: string;
  declare check_daily_thread?: boolean;
  declare commited_version?: string;
}

export const slackBotWebhook = async ({ message_template, slack_token, ...varags }: SlackBotWebhook) => {
  const template = TEMPLATES[message_template];
  if (!template) {
    throw new Error(`Template ${message_template} not found`);
  }

  const client = new WebClient(slack_token);

  const { dir, action } = template;
  const payloadTemplate = fs.readFileSync(dir, 'utf8');
  return action({ message_template: payloadTemplate, client, ...varags });
};
