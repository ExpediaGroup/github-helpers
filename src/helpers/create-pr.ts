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

interface CreatePR {
  title: string;
  source_branch?: string;
  target_branch: string;
  body: string;
  modify?: boolean;
  draft?: boolean;
  issue_number?: string;
}

export const createPr = ({ title, source_branch, target_branch, body, modify, draft, issue_number }: CreatePR) => {
  const sourceToUse = source_branch || context.ref.replace('refs/heads/', '');
  octokit.pulls.create({
    title,
    head: sourceToUse,
    base: target_branch,
    body,
    maintainer_can_modify: modify,
    draft,
    issue: issue_number ? Number(issue_number) : undefined,
    ...context.repo
  });
};
