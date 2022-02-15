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

import { context as githubContext } from '@actions/github';
import { octokit } from '../octokit';

export class RerunPrWorkflows {
  branch = '';
  //maybe fork name should be an optional input?
  // forkName?: string;
}

export const rerunPrWorkflows = async ({ branch }: RerunPrWorkflows) => {
  // list all workflow runs
  const allRuns = await octokit.request('GET /repos/{owner}/{repo}/actions/{branch}', {
    owner: githubContext.repo.owner,
    repo: githubContext.repo.repo,
    branch
  });
  // store the latest run of each workflow
  //double-check the structure of the response.
  const latest = allRuns.data.workflow_runs[0];

  // each workflow run instance has a rerun_url
  // trigger a POST request to the rerun_url to force a rerun
  await octokit.request('POST /repos/{owner}/{repo}/{branch}/actions/runs/{run_id}/rerun', {
    owner: githubContext.repo.owner,
    repo: githubContext.repo.repo,
    run_id: latest.run_id
  });
};
