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
import { HelperInputs } from '../types/generated';
import { GITHUB_OPTIONS } from '../constants';
import { context } from '@actions/github';
import { octokit } from '../octokit';
export class SetDeploymentStatus extends HelperInputs {
    constructor() {
        super(...arguments);
        this.state = '';
        this.environment = '';
    }
}
export const setDeploymentStatus = ({ sha, state, environment, description, target_url, environment_url }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { data } = yield octokit.repos.listDeployments(Object.assign(Object.assign({ sha,
        environment }, context.repo), GITHUB_OPTIONS));
    const deployment_id = (_a = data.find(Boolean)) === null || _a === void 0 ? void 0 : _a.id;
    if (deployment_id) {
        return octokit.repos.createDeploymentStatus(Object.assign(Object.assign({ state: state, deployment_id,
            description,
            target_url,
            environment_url }, context.repo), GITHUB_OPTIONS));
    }
});
//# sourceMappingURL=set-deployment-status.js.map