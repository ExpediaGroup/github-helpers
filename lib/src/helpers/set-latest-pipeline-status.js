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
import { DEFAULT_PIPELINE_STATUS, GITHUB_OPTIONS, PRODUCTION_ENVIRONMENT } from '../constants';
import { HelperInputs } from '../types/generated';
import { context as githubContext } from '@actions/github';
import { octokit } from '../octokit';
export class SetLatestPipelineStatus extends HelperInputs {
    constructor() {
        super(...arguments);
        this.sha = '';
    }
}
export const setLatestPipelineStatus = ({ sha, context = DEFAULT_PIPELINE_STATUS, environment = PRODUCTION_ENVIRONMENT }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { data: deployments } = yield octokit.repos.listDeployments(Object.assign(Object.assign({ environment }, githubContext.repo), GITHUB_OPTIONS));
    const deployment_id = (_a = deployments.find(Boolean)) === null || _a === void 0 ? void 0 : _a.id;
    if (!deployment_id) {
        core.info('No deployments found. Pipeline is clear!');
        return;
    }
    const { data: deploymentStatuses } = yield octokit.repos.listDeploymentStatuses(Object.assign(Object.assign({ deployment_id }, githubContext.repo), GITHUB_OPTIONS));
    const deploymentStatus = (_b = deploymentStatuses.find(Boolean)) !== null && _b !== void 0 ? _b : {};
    const { state, description, target_url } = deploymentStatus;
    return octokit.repos.createCommitStatus(Object.assign({ sha,
        context, state: (_c = deploymentStateToPipelineStateMap[state]) !== null && _c !== void 0 ? _c : 'pending', description,
        target_url }, githubContext.repo));
});
const deploymentStateToPipelineStateMap = {
    in_progress: 'pending',
    success: 'success',
    failure: 'failure',
    inactive: 'error'
};
//# sourceMappingURL=set-latest-pipeline-status.js.map