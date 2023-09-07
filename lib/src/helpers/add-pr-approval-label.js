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
import { CORE_APPROVED_PR_LABEL, PEER_APPROVED_PR_LABEL } from '../constants';
import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import { getCoreMemberLogins } from '../utils/get-core-member-logins';
import { octokit } from '../octokit';
export class AddPrApprovalLabel extends HelperInputs {
    constructor() {
        super(...arguments);
        this.login = '';
    }
}
export const addPrApprovalLabel = ({ teams, login }) => __awaiter(void 0, void 0, void 0, function* () {
    const coreMemberLogins = yield getCoreMemberLogins(context.issue.number, teams === null || teams === void 0 ? void 0 : teams.split('\n'));
    const approvalLabel = coreMemberLogins.includes(login) ? CORE_APPROVED_PR_LABEL : PEER_APPROVED_PR_LABEL;
    return octokit.issues.addLabels(Object.assign({ labels: [approvalLabel], issue_number: context.issue.number }, context.repo));
});
//# sourceMappingURL=add-pr-approval-label.js.map