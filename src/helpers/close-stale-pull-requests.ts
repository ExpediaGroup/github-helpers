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
import { context } from '@actions/github';
import { octokit } from '../octokit';

export class CloseStalePullRequests extends HelperInputs {
  threshold = '';
}

export const closeStalePullRequests = async ({ threshold }: CloseStalePullRequests) => {
  const result = await octokit.pulls.list({
    state: 'open',
    ...context.repo
  });
  // eslint-disable-next-line functional/no-let
  for (let i = 0; i < result.data.length; i++) {
    if (new Date().getTime() - new Date(result.data[i].updated_at).getTime() > Number(threshold) * 24 * 60 * 60) {
      await octokit.pulls.update({
        pull_number: result.data[i].number,
        state: 'closed',
        ...context.repo
      });
    }
  }
};
