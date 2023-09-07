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
import { DEFAULT_PIPELINE_DESCRIPTION, DEFAULT_PIPELINE_STATUS } from '../constants';
import { HelperInputs } from '../types/generated';
import { context as githubContext } from '@actions/github';
import { map } from 'bluebird';
import { octokit } from '../octokit';
export class NotifyPipelineComplete extends HelperInputs {
}
export const notifyPipelineComplete = ({ context = DEFAULT_PIPELINE_STATUS, description = DEFAULT_PIPELINE_DESCRIPTION, target_url }) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield octokit.pulls.list(Object.assign({ state: 'open', per_page: 100 }, githubContext.repo));
    const commitHashes = data.map(pullRequest => pullRequest.head.sha);
    return map(commitHashes, (sha) => __awaiter(void 0, void 0, void 0, function* () {
        return octokit.repos.createCommitStatus(Object.assign({ sha,
            context, state: 'success', description,
            target_url }, githubContext.repo));
    }));
});
//# sourceMappingURL=notify-pipeline-complete.js.map