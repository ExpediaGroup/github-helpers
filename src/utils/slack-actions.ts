import { ChatPostMessageArguments, WebClient } from '@slack/web-api';
import { SlackBotWebhook } from '../helpers/send-slack-message';
import { pickBy } from 'lodash';

export type ActionInput = Omit<SlackBotWebhook, 'slack_token'> & {
  client: WebClient;
};

const validOrThrow = (param: ActionInput[keyof ActionInput]) => {
  if (!param) {
    throw new Error(`Parameter ${param} is required`);
  }
};

const getDailyTs = async (client: WebClient, channel?: string) => {
  const history = await client.conversations.history({
    channel: channel!
  });

  const recentMsg = history.messages?.find(msg => {
    msg.text?.includes('Daily PRs for review');
  });

  return recentMsg?.ts;
};

const replacePlaceholders = (message: string, placeholders: Record<string, string | undefined>) => {
  const filteredHolders = pickBy(placeholders, value => value !== undefined);
  return Object.entries(filteredHolders).reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }, message);
};

export const automatedPr = async ({
  message_template,
  channel,
  check_daily_thread,
  message_tag_id,
  message_tag_name,
  commited_version,
  client,
  bttn_link
}: ActionInput) => {
  [channel, message_tag_id, message_tag_name, commited_version].forEach(i => validOrThrow(i));

  const thread_ts = check_daily_thread ? getDailyTs(client, channel) : undefined;

  const placeHolders: Record<string, string | undefined> = {
    VERSION: commited_version,
    TEAM_ID: message_tag_id,
    TEAM_NAME: message_tag_name,
    PR_URL: bttn_link
  };

  const replacedMesage = replacePlaceholders(message_template, placeHolders);
  const messageObj = JSON.parse(replacedMesage) as ChatPostMessageArguments;
  const payload = {
    ...messageObj,
    channel,
    thread_ts
  } as ChatPostMessageArguments;

  return await client.chat.postMessage(payload);
};
