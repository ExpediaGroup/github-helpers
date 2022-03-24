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
import { octokit } from '../octokit';

export class CreatePR {
  title = '';
  body = '';
  head?: string;
  base?: string;
}

export const createPr = async ({ title, body, head = context.ref.replace('refs/heads/', ''), base }: CreatePR) => {
  const pr_base = base != null ? base : await getDefaultBranch();
  const result = await octokit.pulls.create({
    title,
    head,
    base: pr_base,
    body,
    maintainer_can_modify: true,
    ...context.repo
  });
  const pullNumber = result?.data?.number;
  return pullNumber;
};

async function getDefaultBranch() {
  const {
    data: { default_branch }
  } = await octokit.repos.get({ ...context.repo });
  return default_branch;
}
