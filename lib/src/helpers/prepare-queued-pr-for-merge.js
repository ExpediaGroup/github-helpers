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
import { FIRST_QUEUED_PR_LABEL, JUMP_THE_QUEUE_PR_LABEL, READY_FOR_MERGE_PR_LABEL } from '../constants';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { removePrFromQueue } from './manage-merge-queue';
export const prepareQueuedPrForMerge = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield octokit.pulls.list(Object.assign({ state: 'open', per_page: 100 }, context.repo));
    const pullRequest = findNextPrToMerge(data);
    if (pullRequest) {
        return updatePrWithMainline(pullRequest);
    }
});
const findNextPrToMerge = (pullRequests) => {
    var _a;
    return (_a = pullRequests.find(pr => hasRequiredLabels(pr, [READY_FOR_MERGE_PR_LABEL, JUMP_THE_QUEUE_PR_LABEL]))) !== null && _a !== void 0 ? _a : pullRequests.find(pr => hasRequiredLabels(pr, [READY_FOR_MERGE_PR_LABEL, FIRST_QUEUED_PR_LABEL]));
};
const hasRequiredLabels = (pr, requiredLabels) => requiredLabels.every(mergeQueueLabel => pr.labels.some(label => label.name === mergeQueueLabel));
export const updatePrWithMainline = (pullRequest) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (((_a = pullRequest.head.user) === null || _a === void 0 ? void 0 : _a.login) && ((_b = pullRequest.base.user) === null || _b === void 0 ? void 0 : _b.login) && ((_c = pullRequest.head.user) === null || _c === void 0 ? void 0 : _c.login) !== ((_d = pullRequest.base.user) === null || _d === void 0 ? void 0 : _d.login)) {
        try {
            // update fork default branch with upstream
            yield octokit.repos.mergeUpstream(Object.assign(Object.assign({}, context.repo), { branch: pullRequest.base.repo.default_branch }));
        }
        catch (error) {
            if (error.status === 409) {
                core.setFailed('Attempt to update fork branch with upstream failed; conflict on default branch between fork and upstream.');
            }
            else
                core.setFailed(error.message);
        }
    }
    try {
        yield octokit.repos.merge(Object.assign({ base: pullRequest.head.ref, head: 'HEAD' }, context.repo));
    }
    catch (error) {
        const noEvictUponConflict = core.getBooleanInput('no_evict_upon_conflict');
        if (error.status === 409) {
            if (!noEvictUponConflict)
                yield removePrFromQueue(pullRequest);
            core.setFailed('The first PR in the queue has a merge conflict.');
        }
        else
            core.setFailed(error.message);
    }
});
//# sourceMappingURL=prepare-queued-pr-for-merge.js.map