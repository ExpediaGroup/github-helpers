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
import { GITHUB_OPTIONS } from '../constants';
import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import { octokit } from '../octokit';
export class DeleteDeployment extends HelperInputs {
    constructor() {
        super(...arguments);
        this.sha = '';
        this.environment = '';
    }
}
export const deleteDeployment = ({ sha, environment }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { data } = yield octokit.repos.listDeployments(Object.assign(Object.assign({ sha,
        environment }, context.repo), GITHUB_OPTIONS));
    const deployment_id = (_a = data.find(Boolean)) === null || _a === void 0 ? void 0 : _a.id;
    if (deployment_id) {
        yield octokit.repos.createDeploymentStatus(Object.assign(Object.assign({ state: 'inactive', deployment_id }, context.repo), GITHUB_OPTIONS));
        return Promise.all([
            octokit.repos.deleteDeployment(Object.assign(Object.assign({ deployment_id }, context.repo), GITHUB_OPTIONS)),
            octokit.repos.deleteAnEnvironment(Object.assign(Object.assign({ environment_name: environment }, context.repo), GITHUB_OPTIONS))
        ]);
    }
});
//# sourceMappingURL=delete-deployment.js.map