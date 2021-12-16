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
  source?: string;
  target: string;
  body: string;
  modify?: boolean;
  draft?: boolean;
  issue?: string;
}

export const createPr = ({ title, source, target, body, modify, draft, issue }: CreatePR) => {
  const sourceToUse = source ? source : context.ref.replace('refs/heads/', '');
  octokit.pulls.create({
    title,
    head: String(sourceToUse),
    base: String(target),
    body,
    maintainer_can_modify: modify,
    draft,
    issue: issue ? Number(issue) : undefined,
    ...context.repo
  });
};
