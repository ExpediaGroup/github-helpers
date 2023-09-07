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
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { getDefaultBranch } from '../utils/get-default-branch';
export class CreatePR extends HelperInputs {
    constructor() {
        super(...arguments);
        this.title = '';
        this.body = '';
    }
}
export const createPr = ({ title, body, head = context.ref.replace('refs/heads/', ''), base }) => __awaiter(void 0, void 0, void 0, function* () {
    const pr_base = base || (yield getDefaultBranch());
    yield updateHeadWithBaseBranch(pr_base, head);
    const { data: { number } } = yield octokit.pulls.create(Object.assign({ title,
        head, base: pr_base, body, maintainer_can_modify: true }, context.repo));
    return number;
});
const updateHeadWithBaseBranch = (base, head) => octokit.repos.merge(Object.assign({ base: head, head: base }, context.repo));
//# sourceMappingURL=create-pr.js.map