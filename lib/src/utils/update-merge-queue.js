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
import { JUMP_THE_QUEUE_PR_LABEL, MERGE_QUEUE_STATUS, QUEUED_FOR_MERGE_PREFIX } from '../constants';
import { context } from '@actions/github';
import { map } from 'bluebird';
import { octokit } from '../octokit';
import { removeLabelIfExists } from '../helpers/remove-label';
import { updatePrWithMainline } from '../helpers/prepare-queued-pr-for-merge';
import { setCommitStatus } from '../helpers/set-commit-status';
export const updateMergeQueue = (queuedPrs) => {
    const sortedPrs = sortPrsByQueuePosition(queuedPrs);
    return map(sortedPrs, updateQueuePosition);
};
const sortPrsByQueuePosition = (queuedPrs) => queuedPrs
    .map(pr => {
    var _a, _b;
    const label = (_a = pr.labels.find(label => { var _a; return (_a = label.name) === null || _a === void 0 ? void 0 : _a.startsWith(QUEUED_FOR_MERGE_PREFIX); })) === null || _a === void 0 ? void 0 : _a.name;
    const isJumpingTheQueue = Boolean(pr.labels.find(label => label.name === JUMP_THE_QUEUE_PR_LABEL));
    const queuePosition = isJumpingTheQueue ? 0 : Number((_b = label === null || label === void 0 ? void 0 : label.split('#')) === null || _b === void 0 ? void 0 : _b[1]);
    return {
        number: pr.number,
        label,
        queuePosition
    };
})
    .sort((pr1, pr2) => pr1.queuePosition - pr2.queuePosition);
const updateQueuePosition = (pr, index) => __awaiter(void 0, void 0, void 0, function* () {
    const { number, label, queuePosition } = pr;
    const newQueuePosition = index + 1;
    if (!label || isNaN(queuePosition) || queuePosition === newQueuePosition) {
        return;
    }
    if (newQueuePosition === 1) {
        const { data: pullRequest } = yield octokit.pulls.get(Object.assign({ pull_number: number }, context.repo));
        yield setCommitStatus({
            sha: pullRequest.head.sha,
            context: MERGE_QUEUE_STATUS,
            state: 'success',
            description: 'This PR is next to merge.'
        });
        yield Promise.all([removeLabelIfExists(JUMP_THE_QUEUE_PR_LABEL, number), updatePrWithMainline(pullRequest)]);
    }
    return Promise.all([
        octokit.issues.addLabels(Object.assign({ labels: [`${QUEUED_FOR_MERGE_PREFIX} #${newQueuePosition}`], issue_number: number }, context.repo)),
        removeLabelIfExists(label, number)
    ]);
});
//# sourceMappingURL=update-merge-queue.js.map