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
import { RestEndpointMethodTypes } from '@octokit/rest';
import { each } from "bluebird";

type PullResponseType = RestEndpointMethodTypes["pulls"]["get"]["response"];
type ListResponseType = RestEndpointMethodTypes["pulls"]["list"]["response"];

export class AddPrLateReviewLabels extends HelperInputs {
  owner = '';
  repo = '';
}

export const addPrLateReviewLabels = async ({ owner, repo }: AddPrLateReviewLabels) => {
  var page = 1;
  var pull_requests = await getPRs(owner, repo, page) as ListResponseType;

  while (pull_requests.data.length > 0 ) {
    if (pull_requests.status != 200) {
      //loghere
      continue;
    }

    const pr_data = pull_requests.data || [];
  
    // Loop through all of the issue numbers
    await each(pr_data, async pull_request =>
      await labelPullRequest( 
        pull_request,
        owner,
        repo
      )
    );
    // Setup next PR page
    page += 1;
    // Get all pull requests  
    pull_requests = await getPRs(owner, repo, page);
  }
};

const getPRs = async ( owner: string, repo: string, page: number) => {
  return await octokit.pulls.list({
    owner: owner,
    repo: repo,
    state: "open",
    sort: "created",
    per_page: 100,
    page: page
  }) as ListResponseType;
}

const labelPullRequest = async ( pull_request: any, owner: string, repo: string) => {
  const pr = parseInt(pull_request.id);
  // Get the PR
  const pull_request_data = await octokit.pulls.get({
      owner: owner,
      repo: repo,
      pull_number: pr
    });

  // Checks if the PR is within the Late Review timeframe
  if (!await isLabelNeeded(pull_request_data.data)) {
    return;
  } 

  // Only update labels if its qualified for label
  octokit.issues.addLabels({
    labels: [LATE_REVIEW],
    issue_number: pr,
    owner: owner,
    repo: repo
  });
}

const isLabelNeeded = async ( { mergeable_state, updated_at}: any ) => {
  const last_updated = new Date( updated_at );
  const now = new Date();
  const age = now.getTime() - last_updated.getTime();
  const oneDay = 86400000;
  return age > oneDay * 2 && mergeable_state == "blocked";
}
