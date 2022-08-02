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

import { LATE_REVIEW, STALE } from '../constants';
import { HelperInputs } from '../types/generated';
import { octokit } from '../octokit';
import { RestEndpointMethodTypes } from '@octokit/rest';

type PullResponseType = RestEndpointMethodTypes["pulls"]["get"]["response"];

export class AddPrStaleLabel extends HelperInputs {
  prs = '';
  owner = '';
  repo = '';
}

/* Adds labels to Pull Requests when they become "Stale" or "Late Review"
 * @param [Array] prs: array of the pull request ids
 * @param [string] owner: name of the repo's owner
 * @param [string] repo: name of the repo
 */
export const addPrStaleLabel = async ({ prs, owner, repo }: AddPrStaleLabel) => {
  var pull_requests = prs.split(',');
  var pull_request_data;
  var pr;
  var num_requests = pull_requests.length;
  var label;

  // Loop through all of the issue numbers
  for (var i = 0; i < num_requests; i++) {
    label = [];
    pr = parseInt(pull_requests[i]);
    // Get the PR
    pull_request_data = await octokit.pulls.get({
        owner: owner,
        repo: repo,
        pull_number: pr
      }) as PullResponseType;

    // Checks if the PR is within the Stale timeframe - no activity for 10 days, waiting on contributor
    if (await isLabelNeeded(pull_request_data, STALE)) {
      label.push(STALE);
    }  else if (await isLabelNeeded(pull_request_data, LATE_REVIEW)) {
      label.push(LATE_REVIEW);
    } else {
      continue;
    }

    // Only update labels if its qualified for label
    octokit.issues.addLabels({
      labels: label,
      issue_number: pr,
      owner: owner,
      repo: repo
    });
  }
};

/* Checks if the given label type is needed for the Pull Request prData
 * @param [PullResponseType] prData: data object returned by octokit.pulls.get()
 * @param [string] label: Label wanted to be added (currently supporting labels STALE and LATE_REVIEW)
 * @return [Boolean] whether or not the provided label is needed for the pull request
 */
const isLabelNeeded = async ( prData: PullResponseType, label: string )=> {
  if (prData == null) {
    return false;
  }
  const last_updated = new Date(prData.data.updated_at);
  const now = new Date();
  const age = now.getTime() - last_updated.getTime();
  const margeable_state = prData.data.mergeable_state;
  var days, state;
  
  switch (label) {
    case STALE:
      days = 10;
      state = "unknown";
      break;
    case LATE_REVIEW:
      days = 2;
      state = "blocked";
      break;
    default:
      return false;
  }

  if ( age > 86400000 * days && margeable_state == state ) {
    return true;
  }
  return false;
}
