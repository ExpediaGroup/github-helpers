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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as core from '@actions/core';
import { context } from '@actions/github';
import { map } from 'bluebird';
import { octokit } from '../octokit';
import { request } from '@octokit/request';
export const rerunPrChecks = () => __awaiter(void 0, void 0, void 0, function* () {
    /** grab owner in case of fork branch */
    const { data: { head: { user: { login: owner }, sha: latestHash, ref: branch } } } = yield octokit.pulls.get(Object.assign({ pull_number: context.issue.number }, context.repo));
    const workflowRunResponses = yield map(['pull_request', 'pull_request_target'], event => octokit.actions.listWorkflowRunsForRepo(Object.assign(Object.assign({ branch }, context.repo), { owner,
        event, per_page: 100, status: 'completed' })));
    const workflowRuns = workflowRunResponses.map(response => response.data.workflow_runs).flat();
    if (!workflowRuns.length) {
        core.info(`No workflow runs found on branch ${branch} on ${owner}/${context.repo.repo}`);
        return;
    }
    const latestWorkflowRuns = workflowRuns.filter(({ head_sha }) => head_sha === latestHash);
    core.info(`There are ${latestWorkflowRuns.length} checks associated with the latest commit, triggering reruns...`);
    return map(latestWorkflowRuns, ({ id, name, rerun_url }) => __awaiter(void 0, void 0, void 0, function* () {
        core.info(`- Rerunning ${name} (${id})`);
        yield request(`POST ${rerun_url}`, {
            headers: {
                authorization: `token ${core.getInput('github_token')}`
            }
        }).catch(error => {
            core.setFailed(error.message);
        });
    }));
});
//# sourceMappingURL=rerun-pr-checks.js.map