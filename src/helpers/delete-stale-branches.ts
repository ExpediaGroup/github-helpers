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
import { map } from 'bluebird';
import { paginateAllOpenPullRequests } from '../utils/paginate-open-pull-requests';
import { PullRequestBranchesList } from '../types/github';

export class DeleteStaleBranches extends HelperInputs {
  days?: string;
}

export const deleteStaleBranches = async ({ days = '30' }: DeleteStaleBranches = {}) => {
  const openPullRequests = await paginateAllOpenPullRequests();
  const openPullRequestBranches = openPullRequests.map(pr => pr.head.ref);
  const allBranches = await paginateAllUnprotectedBranches();
  const branchesWithNoOpenPullRequest = allBranches.filter(({ name }) => !openPullRequestBranches.includes(name));
  const branchesWithUpdatedDates = await map(branchesWithNoOpenPullRequest, async ({ name, commit: { sha } }) => {
    const {
      data: {
        committer: { date }
      }
    } = await octokit.git.getCommit({
      commit_sha: sha,
      ...context.repo
    });
    return {
      name,
      date
    };
  });

  const branchesToDelete = branchesWithUpdatedDates.filter(({ date }) => branchIsTooOld(date, days)).map(({ name }) => name);
  await map(branchesToDelete, async branch => {
    await octokit.git.deleteRef({
      ref: branch,
      ...context.repo
    });
  });
};

const branchIsTooOld = (dateLastUpdated: string, daysThreshold: string) => {
  const lastUpdated = new Date(dateLastUpdated);
  const now = Date.now();
  const timeSinceLastUpdated = now - lastUpdated.getTime();
  const threshold = Number(daysThreshold) * 86400000;

  return timeSinceLastUpdated > threshold;
};

export const paginateAllUnprotectedBranches = async (page = 1): Promise<PullRequestBranchesList> => {
  const response = await octokit.repos.listBranches({
    protected: false,
    per_page: 100,
    page,
    ...context.repo
  });
  if (!response.data.length) {
    return [];
  }
  return response.data.concat(await paginateAllUnprotectedBranches(page + 1));
};
