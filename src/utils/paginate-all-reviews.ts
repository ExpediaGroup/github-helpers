/*
Copyright 2022 Expedia, Inc.
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

import { PullRequestReviewList } from '../types/github';
import { octokit } from '../octokit';
import { context } from '@actions/github';

export const paginateAllReviews = async (prNumber: number, page = 1): Promise<PullRequestReviewList> => {
  const response = await octokit.pulls.listReviews({
    pull_number: prNumber,
    per_page: 100,
    page,
    ...context.repo
  });
  if (!response.data.length) {
    return [];
  }
  return response.data.concat(await paginateAllReviews(prNumber, page + 1));
};
