/*
Copyright 2023 Expedia, Inc.
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

import { IssueList } from '../types/github';
import { octokit } from '../octokit';
import { context } from '@actions/github';

export const paginateAllOpenIssues = async (page = 1): Promise<IssueList> => {
  const response = await octokit.issues.listForRepo({
    state: 'open',
    sort: 'created',
    direction: 'desc',
    per_page: 100,
    page,
    ...context.repo
  });
  if (!response || !response.data.length) {
    return [];
  }
  return (response.data as IssueList).concat(await paginateAllOpenIssues(page + 1));
};
