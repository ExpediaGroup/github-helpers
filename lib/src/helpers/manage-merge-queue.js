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
import { FIRST_QUEUED_PR_LABEL, JUMP_THE_QUEUE_PR_LABEL, MERGE_QUEUE_STATUS, QUEUED_FOR_MERGE_PREFIX, READY_FOR_MERGE_PR_LABEL } from '../constants';
import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import { map } from 'bluebird';
import { notifyUser } from '../utils/notify-user';
import { octokit, octokitGraphql } from '../octokit';
import { removeLabelIfExists } from './remove-label';
import { setCommitStatus } from './set-commit-status';
import { updateMergeQueue } from '../utils/update-merge-queue';
import { paginateAllOpenPullRequests } from '../utils/paginate-open-pull-requests';
export class ManageMergeQueue extends HelperInputs {
}
export const manageMergeQueue = ({ login, slack_webhook_url } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const { data: pullRequest } = yield octokit.pulls.get(Object.assign({ pull_number: context.issue.number }, context.repo));
    if (pullRequest.merged || !pullRequest.labels.find(label => label.name === READY_FOR_MERGE_PR_LABEL)) {
        core.info('This PR is not in the merge queue.');
        return removePrFromQueue(pullRequest);
    }
    const queuedPrs = yield getQueuedPullRequests();
    const queuePosition = queuedPrs.length;
    if (pullRequest.labels.find(label => label.name === JUMP_THE_QUEUE_PR_LABEL)) {
        return updateMergeQueue(queuedPrs);
    }
    if (!pullRequest.labels.find(label => { var _a; return (_a = label.name) === null || _a === void 0 ? void 0 : _a.startsWith(QUEUED_FOR_MERGE_PREFIX); })) {
        yield addPrToQueue(pullRequest, queuePosition);
    }
    const isFirstQueuePosition = queuePosition === 1 || pullRequest.labels.find(label => label.name === FIRST_QUEUED_PR_LABEL);
    yield setCommitStatus({
        sha: pullRequest.head.sha,
        context: MERGE_QUEUE_STATUS,
        state: isFirstQueuePosition ? 'success' : 'pending',
        description: isFirstQueuePosition ? 'This PR is next to merge.' : 'This PR is in line to merge.'
    });
    if (slack_webhook_url && login && queuePosition === 1) {
        yield notifyUser({
            login,
            pull_number: context.issue.number,
            slack_webhook_url
        });
    }
});
export const removePrFromQueue = (pullRequest) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const queueLabel = (_a = pullRequest.labels.find(label => { var _a; return (_a = label.name) === null || _a === void 0 ? void 0 : _a.startsWith(QUEUED_FOR_MERGE_PREFIX); })) === null || _a === void 0 ? void 0 : _a.name;
    if (queueLabel) {
        yield map([READY_FOR_MERGE_PR_LABEL, queueLabel], (label) => __awaiter(void 0, void 0, void 0, function* () { return removeLabelIfExists(label, pullRequest.number); }));
        yield setCommitStatus({
            sha: pullRequest.head.sha,
            context: MERGE_QUEUE_STATUS,
            state: 'pending',
            description: 'This PR is not in the merge queue.'
        });
        const queuedPrs = yield getQueuedPullRequests();
        yield updateMergeQueue(queuedPrs);
    }
});
const addPrToQueue = (pullRequest, queuePosition) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all([
        octokit.issues.addLabels(Object.assign({ labels: [`${QUEUED_FOR_MERGE_PREFIX} #${queuePosition}`], issue_number: context.issue.number }, context.repo)),
        enableAutoMerge(pullRequest.node_id)
    ]);
});
const getQueuedPullRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    const openPullRequests = yield paginateAllOpenPullRequests();
    return openPullRequests.filter(pr => pr.labels.some(label => label.name === READY_FOR_MERGE_PR_LABEL));
});
export const enableAutoMerge = (pullRequestId, mergeMethod = 'SQUASH') => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return octokitGraphql(`
    mutation {
      enablePullRequestAutoMerge(input: { pullRequestId: "${pullRequestId}", mergeMethod: ${mergeMethod} }) {
        clientMutationId
      }
    }
  `);
    }
    catch (error) {
        core.warning('Auto merge could not be enabled. Perhaps you need to enable auto-merge on your repo?');
        core.warning(error);
    }
});
//# sourceMappingURL=manage-merge-queue.js.map