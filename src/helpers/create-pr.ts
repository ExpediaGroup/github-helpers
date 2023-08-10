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
import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { getDefaultBranch } from '../utils/get-default-branch';

export class CreatePR extends HelperInputs {
  title = '';
  body = '';
  head?: string;
  base?: string;
  return_full_payload?: string;
}

export const createPr = async ({ title, body, head = context.ref.replace('refs/heads/', ''), base }: CreatePR) => {
  const pr_base = base || (await getDefaultBranch());
  await updateHeadWithBaseBranch(pr_base, head);
  const { data } = await octokit.pulls.create({
    title,
    head,
    base: pr_base,
    body,
    maintainer_can_modify: true,
    ...context.repo
  });
  const return_full_payload = core.getBooleanInput('return_full_payload');
  return return_full_payload ? data : data.number;
};

const updateHeadWithBaseBranch = (base: string, head: string) =>
  octokit.repos.merge({
    base: head,
    head: base,
    ...context.repo
  });
