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
import { context } from '@actions/github';
import { getCoreMemberLogins } from '../utils/get-core-member-logins';
import { map } from 'bluebird';
import { notifyUser } from '../utils/notify-user';
import { octokit } from '../octokit';
import { sampleSize } from 'lodash';
import { CORE_APPROVED_PR_LABEL } from '../constants';
export class AssignPrReviewer extends HelperInputs {
}
export const assignPrReviewers = ({ teams, login, number_of_assignees = '1', slack_webhook_url, pull_number = String(context.issue.number) }) => __awaiter(void 0, void 0, void 0, function* () {
    const coreMemberLogins = yield getCoreMemberLogins(context.issue.number, teams === null || teams === void 0 ? void 0 : teams.split('\n'));
    const { data: { user, labels } } = yield octokit.pulls.get(Object.assign({ pull_number: context.issue.number }, context.repo));
    if (login && coreMemberLogins.includes(login)) {
        core.info('Already a core member, no need to assign.');
        return;
    }
    if (labels === null || labels === void 0 ? void 0 : labels.find(label => label.name === CORE_APPROVED_PR_LABEL)) {
        core.info('Already approved by a core member, no need to assign.');
        return;
    }
    const prAuthorUsername = user === null || user === void 0 ? void 0 : user.login;
    const filteredCoreMemberLogins = coreMemberLogins.filter(userName => userName !== prAuthorUsername);
    const assignees = sampleSize(filteredCoreMemberLogins, Number(number_of_assignees));
    yield octokit.issues.addAssignees(Object.assign({ assignees, issue_number: Number(pull_number) }, context.repo));
    if (slack_webhook_url) {
        return map(assignees, (assignee) => __awaiter(void 0, void 0, void 0, function* () {
            return notifyUser({
                login: assignee,
                pull_number: Number(pull_number),
                slack_webhook_url
            });
        }));
    }
});
//# sourceMappingURL=assign-pr-reviewers.js.map