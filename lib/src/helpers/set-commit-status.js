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
import { HelperInputs } from '../types/generated';
import { context as githubContext } from '@actions/github';
import { map } from 'bluebird';
import { octokit } from '../octokit';
export class SetCommitStatus extends HelperInputs {
    constructor() {
        super(...arguments);
        this.sha = '';
        this.context = '';
        this.state = '';
    }
}
export const setCommitStatus = ({ sha, context, state, description, target_url, skip_if_already_set }) => __awaiter(void 0, void 0, void 0, function* () {
    yield map(context.split('\n').filter(Boolean), (context) => __awaiter(void 0, void 0, void 0, function* () {
        if (skip_if_already_set === 'true') {
            const check_runs = yield octokit.checks.listForRef(Object.assign(Object.assign({}, githubContext.repo), { ref: sha }));
            const run = check_runs.data.check_runs.find(({ name }) => name === context);
            if (run) {
                const runCompletedAndIsValid = run.status === 'completed' && (run.conclusion === 'failure' || run.conclusion === 'success');
                if (runCompletedAndIsValid) {
                    core.info(`${context} already completed with a ${run.conclusion} conclusion.`);
                    return;
                }
            }
        }
        octokit.repos.createCommitStatus(Object.assign({ sha,
            context, state: state, description,
            target_url }, githubContext.repo));
    }));
});
//# sourceMappingURL=set-commit-status.js.map