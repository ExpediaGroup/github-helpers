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
import { createPrComment } from './create-pr-comment';

export class ClosePr extends HelperInputs {
  declare body?: string;
  declare pull_number?: string;
  declare repo_name?: string;
  declare repo_owner_name?: string;
}

export const closePr = async ({ body, pull_number, repo_name, repo_owner_name }: ClosePr = {}) => {
  if ((repo_name || repo_owner_name) && !pull_number) {
    throw new Error('pull_number is required when repo_name or repo_owner_name is provided');
  }
  if (body) {
    await createPrComment({ body, pull_number, repo_name, repo_owner_name });
  }

  return octokit.pulls.update({
    pull_number: pull_number ? Number(pull_number) : context.issue.number,
    repo: repo_name ?? context.repo.repo,
    owner: repo_owner_name ?? context.repo.owner,
    state: 'closed'
  });
};
