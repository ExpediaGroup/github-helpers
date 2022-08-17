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

import { LATE_REVIEW } from '../constants';
import { HelperInputs } from '../types/generated';
import { octokit } from '../octokit';
import { map } from 'bluebird';
import { paginateAllOpenPullRequests } from '../utils/paginate-open-pull-requests';
import { SimplePullRequest } from '../types/github';

export class AddLateReviewLabel extends HelperInputs {
  owner = '';
  repo = '';
  days?: string;
}

export const addLateReviewLabel = async ({ owner, repo, days = '1' }: AddLateReviewLabel) => {
  const openPullRequests = await paginateAllOpenPullRequests();

  return map(openPullRequests, pr => {
    if (!isLabelNeeded(pr, Number(days))) {
      return;
    }

    return octokit.issues.addLabels({
      labels: [LATE_REVIEW],
      issue_number: pr.number,
      owner,
      repo
    });
  });
};

const isLabelNeeded = ({ requested_reviewers, requested_teams, updated_at }: SimplePullRequest, days: number) => {
  const last_updated = new Date(updated_at);
  const now = new Date();
  const timeSinceLastUpdated = now.getTime() - last_updated.getTime();
  const dayThreshold = days * 86400000;
  const isWaitingOnReviewers = Boolean(requested_reviewers || requested_teams);
  return timeSinceLastUpdated > dayThreshold && isWaitingOnReviewers;
};
