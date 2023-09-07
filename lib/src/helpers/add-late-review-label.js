/*
Copyright 2022 Expedia, Inc.
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
import { LATE_REVIEW } from '../constants';
import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { map } from 'bluebird';
import { paginateAllOpenPullRequests } from '../utils/paginate-open-pull-requests';
export class AddLateReviewLabel extends HelperInputs {
}
export const addLateReviewLabel = ({ days = '1' }) => __awaiter(void 0, void 0, void 0, function* () {
    const openPullRequests = yield paginateAllOpenPullRequests();
    return map(openPullRequests, pr => {
        if (!isLabelNeeded(pr, Number(days))) {
            return;
        }
        return octokit.issues.addLabels(Object.assign({ labels: [LATE_REVIEW], issue_number: pr.number }, context.repo));
    });
});
const isLabelNeeded = ({ requested_reviewers, requested_teams, updated_at }, days) => {
    const last_updated = new Date(updated_at);
    const now = new Date();
    const timeSinceLastUpdated = now.getTime() - last_updated.getTime();
    const dayThreshold = days * 86400000;
    const isWaitingOnReviewers = Boolean(requested_reviewers || requested_teams);
    return timeSinceLastUpdated > dayThreshold && isWaitingOnReviewers;
};
//# sourceMappingURL=add-late-review-label.js.map