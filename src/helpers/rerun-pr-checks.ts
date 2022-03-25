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

import * as core from '@actions/core';
import { context } from '@actions/github';
import { map } from 'bluebird';
import { octokit } from '../octokit';
import { request } from '@octokit/request';

export const rerunPrChecks = async () => {
  /** grab owner in case of fork branch */
  const {
    data: {
      head: {
        user: { login: owner },
        sha: latestHash,
        ref: branch
      }
    }
  } = await octokit.pulls.get({
    pull_number: context.issue.number,
    ...context.repo
  });
  const workflowRuns = await octokit.actions.listWorkflowRunsForRepo({
    branch,
    ...context.repo,
    owner,
    event: 'pull_request',
    per_page: 100
  });
  if (!workflowRuns.data.workflow_runs.length) {
    core.info(`No workflow runs found on branch ${branch} on ${owner}/${context.repo.repo}`);
    return;
  }
  const latestWorkflowRuns = workflowRuns.data.workflow_runs.filter(({ head_sha }) => head_sha === latestHash);
  core.info(`The latest runs on this branch are ${latestWorkflowRuns.map(run => run.name)}, triggering reruns...`);

  return map(latestWorkflowRuns, async ({ id, name }) => {
    core.info(`- Rerunning ${name}`);
    await request('POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun', {
      owner,
      repo: context.repo.repo,
      run_id: id,
      headers: {
        authorization: `token ${core.getInput('github_token')}`
      }
    }).catch(error => {
      core.info(JSON.stringify(error));
    });
  });
};
