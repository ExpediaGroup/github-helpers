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
import { error } from '@actions/core';
import { PushEvent } from '@octokit/webhooks-types';

export const createBatchedCommitMessage = () => {
  const eventPayload = context.payload as PushEvent;
  if (!('commits' in eventPayload)) {
    error('No commits found in the event payload.');
    return;
  }

  const maxCharactersPerMessage = 50;

  return eventPayload.commits
    .map(commit => {
      const prNumberMatch = commit.message.match(/\(#(\d+)\)/)?.[0] ?? '';
      const messageWithoutPrNumber = commit.message.replace(prNumberMatch, '').trim();
      const truncatedMessage = messageWithoutPrNumber.slice(0, maxCharactersPerMessage);
      if (truncatedMessage.length < messageWithoutPrNumber.length) {
        return `${truncatedMessage}... ${prNumberMatch ?? 'PR unknown'}`;
      }
      return commit.message;
    })
    .join(' and ');
};
