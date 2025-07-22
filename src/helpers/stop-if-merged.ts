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
import * as core from '@actions/core';
import { octokit } from '../octokit';

export class StopIfMerged extends HelperInputs {
  pull_request_number = '';
}

export const stopIfMerged = async ({ pull_request_number }: StopIfMerged) => {
  const { data } = await octokit.pulls.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: parseInt(pull_request_number)
  });

  if (data.merged) {
    throw new Error(`Pull request #${pull_request_number} is already merged.`);
  } else {
    core.info(`Pull request #${pull_request_number} is not merged. Workflow will continue...`);
  }
};
