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
import { getDefaultBranch } from '../utils/get-default-branch';
import simpleGit from 'simple-git';

export class CreatePR extends HelperInputs {
  title = '';
  body = '';
  commit_message: string = '';
  declare head?: string;
  declare base?: string;
  declare return_full_payload?: string;
  declare branch_name?: string;
}

export const createPr = async ({ title, body, head, base, return_full_payload, branch_name, commit_message }: CreatePR) => {
  const resolvedHead = await getOrCreateHeadBranch({ head, branch_name, commit_message });

  const pr_base = base || (await getDefaultBranch());
  await updateHeadWithBaseBranch(pr_base, resolvedHead);
  const { data } = await octokit.pulls.create({
    title,
    head: resolvedHead,
    base: pr_base,
    body,
    maintainer_can_modify: true,
    ...context.repo
  });
  return return_full_payload === 'true' ? data : data.number;
};

const getOrCreateHeadBranch = async ({ head, branch_name, commit_message }: Partial<CreatePR>): Promise<string> => {
  if (branch_name && commit_message) {
    const git = simpleGit();

    await git.checkoutLocalBranch(branch_name);
    await git.add('.');
    await git.commit(commit_message);
    await git.push('origin', branch_name);

    return branch_name;
  }

  return head || context.ref.replace('refs/heads/', '');
};

const updateHeadWithBaseBranch = (base: string, head: string) =>
  octokit.repos.merge({
    base: head,
    head: base,
    ...context.repo
  });
