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
export class CreatePrComment extends HelperInputs {
    constructor() {
        super(...arguments);
        this.body = '';
    }
}
export const createPrComment = ({ body, sha, login }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!sha && !login) {
        return octokit.issues.createComment(Object.assign({ body, issue_number: context.issue.number }, context.repo));
    }
    if (sha) {
        const { data } = yield octokit.repos.listPullRequestsAssociatedWithCommit(Object.assign(Object.assign({ commit_sha: sha }, context.repo), GITHUB_OPTIONS));
        const prNumber = (_a = data.find(Boolean)) === null || _a === void 0 ? void 0 : _a.number;
        if (prNumber) {
            return octokit.issues.createComment(Object.assign({ body, issue_number: prNumber }, context.repo));
        }
    }
    if (login) {
        const { data } = yield octokit.issues.listComments(Object.assign({ issue_number: context.issue.number }, context.repo));
        const comment_id = (_b = data.find(comment => { var _a; return ((_a = comment === null || comment === void 0 ? void 0 : comment.user) === null || _a === void 0 ? void 0 : _a.login) === login; })) === null || _b === void 0 ? void 0 : _b.id;
        if (comment_id) {
            return octokit.issues.updateComment(Object.assign({ comment_id,
                body }, context.repo));
        }
    }
});
//# sourceMappingURL=create-pr-comment.js.map