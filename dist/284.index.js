export const id = 284;
export const ids = [284];
export const modules = {

/***/ 4862:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetEmailOnUserProfile: () => (/* binding */ GetEmailOnUserProfile),
/* harmony export */   getEmailOnUserProfile: () => (/* binding */ getEmailOnUserProfile)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8428);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6590);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_1__);
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



class GetEmailOnUserProfile extends _types_generated__WEBPACK_IMPORTED_MODULE_2__/* .HelperInputs */ .m {
    login = '';
}
const getEmailOnUserProfile = async ({ login, pattern }) => {
    const { data: { email } } = await _octokit__WEBPACK_IMPORTED_MODULE_0__/* .octokit */ .A.users.getByUsername({ username: login });
    if (!email) {
        (0,_actions_core__WEBPACK_IMPORTED_MODULE_1__.setFailed)(`User ${login} does not have an email address on their GitHub profile!`);
        return;
    }
    if (pattern && !new RegExp(pattern).test(email)) {
        (0,_actions_core__WEBPACK_IMPORTED_MODULE_1__.setFailed)(`Email ${email} does not match regex pattern ${pattern}. Please update the email on your GitHub profile to match this pattern!`);
        return;
    }
    return email;
};


/***/ }),

/***/ 8783:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IsUserInTeam: () => (/* binding */ IsUserInTeam),
/* harmony export */   isUserInTeam: () => (/* binding */ isUserInTeam)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6590);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_2__);
/*
Copyright 2023 Expedia, Inc.
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




class IsUserInTeam extends _types_generated__WEBPACK_IMPORTED_MODULE_3__/* .HelperInputs */ .m {
    team = '';
}
const isUserInTeam = async ({ login = _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.actor, team }) => {
    const members = await paginateAllMembersInOrg(team);
    _actions_core__WEBPACK_IMPORTED_MODULE_2__.info(`Checking if ${login} is in team ${team}`);
    _actions_core__WEBPACK_IMPORTED_MODULE_2__.info(`Team members: ${members.map(({ login }) => login).join(', ')}`);
    return members.some(({ login: memberLogin }) => memberLogin === login);
};
async function paginateAllMembersInOrg(team, page = 1) {
    const response = await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.teams.listMembersInOrg({
        org: _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.owner,
        team_slug: team,
        page,
        per_page: 100
    });
    if (!response.data.length) {
        return [];
    }
    return response.data.concat(await paginateAllMembersInOrg(team, page + 1));
}


/***/ }),

/***/ 4703:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ManageMergeQueue: () => (/* binding */ ManageMergeQueue),
  enableAutoMerge: () => (/* binding */ enableAutoMerge),
  manageMergeQueue: () => (/* binding */ manageMergeQueue),
  removePrFromQueue: () => (/* binding */ removePrFromQueue)
});

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js
var core = __webpack_require__(7484);
// EXTERNAL MODULE: ./src/constants.ts
var constants = __webpack_require__(7242);
// EXTERNAL MODULE: ./src/types/generated.ts
var generated = __webpack_require__(8428);
// EXTERNAL MODULE: ./node_modules/@actions/github/lib/github.js
var github = __webpack_require__(3228);
// EXTERNAL MODULE: ./src/utils/notify-user.ts
var notify_user = __webpack_require__(9190);
// EXTERNAL MODULE: ./src/octokit.ts
var octokit = __webpack_require__(6590);
// EXTERNAL MODULE: ./src/helpers/remove-label.ts
var remove_label = __webpack_require__(5598);
// EXTERNAL MODULE: ./src/helpers/set-commit-status.ts
var set_commit_status = __webpack_require__(9250);
// EXTERNAL MODULE: ./node_modules/bluebird/js/release/bluebird.js
var bluebird = __webpack_require__(4366);
// EXTERNAL MODULE: ./src/helpers/prepare-queued-pr-for-merge.ts
var prepare_queued_pr_for_merge = __webpack_require__(6546);
;// CONCATENATED MODULE: ./src/utils/update-merge-queue.ts
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







const updateMergeQueue = (queuedPrs) => {
    const sortedPrs = sortPrsByQueuePosition(queuedPrs);
    return (0,bluebird.map)(sortedPrs, updateQueuePosition);
};
const sortPrsByQueuePosition = (queuedPrs) => queuedPrs
    .map(pr => {
    const label = pr.labels.find(label => label.name?.startsWith(constants/* QUEUED_FOR_MERGE_PREFIX */.KE))?.name;
    const hasJumpTheQueueLabel = Boolean(pr.labels.find(label => label.name === constants/* JUMP_THE_QUEUE_PR_LABEL */.hU));
    const queuePosition = Number(label?.split('#')?.[1]);
    return {
        number: pr.number,
        label,
        hasJumpTheQueueLabel,
        queuePosition,
        sha: pr.head.sha
    };
})
    .sort((pr1, pr2) => {
    if (pr1.hasJumpTheQueueLabel) {
        return -1;
    }
    if (pr2.hasJumpTheQueueLabel) {
        return 1;
    }
    return pr1.queuePosition - pr2.queuePosition;
});
const updateQueuePosition = async (pr, index) => {
    const { number, label, queuePosition, sha, hasJumpTheQueueLabel } = pr;
    const newQueuePosition = index + 1;
    if (!label || isNaN(queuePosition) || queuePosition === newQueuePosition) {
        return;
    }
    if (hasJumpTheQueueLabel) {
        await (0,remove_label.removeLabelIfExists)(constants/* JUMP_THE_QUEUE_PR_LABEL */.hU, number);
    }
    const prIsNowFirstInQueue = newQueuePosition === 1;
    if (prIsNowFirstInQueue) {
        const { data: firstPrInQueue } = await octokit/* octokit */.A.pulls.get({ pull_number: number, ...github.context.repo });
        await (0,prepare_queued_pr_for_merge.updatePrWithDefaultBranch)(firstPrInQueue);
        const { data: { head: { sha: updatedHeadSha } } } = await octokit/* octokit */.A.pulls.get({ pull_number: number, ...github.context.repo });
        return Promise.all([
            octokit/* octokit */.A.issues.addLabels({
                labels: [`${constants/* QUEUED_FOR_MERGE_PREFIX */.KE} #${newQueuePosition}`],
                issue_number: number,
                ...github.context.repo
            }),
            (0,remove_label.removeLabelIfExists)(label, number),
            (0,set_commit_status.setCommitStatus)({
                sha: updatedHeadSha,
                context: constants/* MERGE_QUEUE_STATUS */.Qw,
                state: 'success',
                description: 'This PR is next to merge.'
            })
        ]);
    }
    return Promise.all([
        octokit/* octokit */.A.issues.addLabels({
            labels: [`${constants/* QUEUED_FOR_MERGE_PREFIX */.KE} #${newQueuePosition}`],
            issue_number: number,
            ...github.context.repo
        }),
        (0,remove_label.removeLabelIfExists)(label, number),
        (0,set_commit_status.setCommitStatus)({
            sha,
            context: constants/* MERGE_QUEUE_STATUS */.Qw,
            state: 'pending',
            description: 'This PR is in line to merge.'
        })
    ]);
};

// EXTERNAL MODULE: ./src/utils/paginate-open-pull-requests.ts
var paginate_open_pull_requests = __webpack_require__(3332);
// EXTERNAL MODULE: ./src/helpers/approvals-satisfied.ts + 2 modules
var approvals_satisfied = __webpack_require__(419);
// EXTERNAL MODULE: ./src/helpers/create-pr-comment.ts
var create_pr_comment = __webpack_require__(9280);
// EXTERNAL MODULE: ./src/helpers/is-user-in-team.ts
var is_user_in_team = __webpack_require__(8783);
// EXTERNAL MODULE: ./src/helpers/get-email-on-user-profile.ts
var get_email_on_user_profile = __webpack_require__(4862);
;// CONCATENATED MODULE: ./src/helpers/manage-merge-queue.ts
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















class ManageMergeQueue extends generated/* HelperInputs */.m {
}
const manageMergeQueue = async ({ max_queue_size, login, slack_webhook_url, skip_auto_merge, team = '', allow_only_for_maintainers, pattern } = {}) => {
    const { data: pullRequest } = await octokit/* octokit */.A.pulls.get({ pull_number: github.context.issue.number, ...github.context.repo });
    if (pullRequest.merged || !pullRequest.labels.find(label => label.name === constants/* READY_FOR_MERGE_PR_LABEL */.ZV)) {
        core.info('This PR is not in the merge queue.');
        return removePrFromQueue(pullRequest);
    }
    const prMeetsRequiredApprovals = await (0,approvals_satisfied.approvalsSatisfied)({
        body: 'PRs must meet all required approvals before entering the merge queue.'
    });
    if (!prMeetsRequiredApprovals) {
        return removePrFromQueue(pullRequest);
    }
    if (slack_webhook_url && login) {
        const email = await (0,get_email_on_user_profile.getEmailOnUserProfile)({ login, pattern });
        if (!email) {
            const patternText = pattern ? `, and it must match the regex pattern \`${pattern}\`` : '';
            await (0,create_pr_comment.createPrComment)({
                body: `@${login} Your PR cannot be added to the queue because your email must be set on your GitHub profile${patternText}. Follow the instructions [here](${githubEmailDocsLink}) to add or fix your email on ${github.context.serverUrl}!`
            });
            return removePrFromQueue(pullRequest);
        }
    }
    const queuedPrs = await getQueuedPullRequests();
    const queuePosition = queuedPrs.length + 1;
    const prAttemptingToJoinQueue = pullRequest.labels.every(label => !label.name?.startsWith(constants/* QUEUED_FOR_MERGE_PREFIX */.KE));
    if (prAttemptingToJoinQueue && queuePosition > Number(max_queue_size)) {
        await (0,create_pr_comment.createPrComment)({
            body: `The merge queue is full! Only ${max_queue_size} PRs are allowed in the queue at a time.\n\nIf you would like to merge your PR, please monitor the PRs in the queue and make sure the authors are around to merge them.`
        });
        return removePrFromQueue(pullRequest);
    }
    if (pullRequest.labels.find(label => label.name === constants/* JUMP_THE_QUEUE_PR_LABEL */.hU)) {
        if (allow_only_for_maintainers === 'true') {
            core.info(`Checking if user ${login} is a maintainer...`);
            const isMaintainer = await (0,is_user_in_team.isUserInTeam)({ login: github.context.actor, team: team });
            if (!isMaintainer) {
                await (0,remove_label.removeLabelIfExists)(constants/* JUMP_THE_QUEUE_PR_LABEL */.hU, pullRequest.number);
                return await (0,create_pr_comment.createPrComment)({
                    body: `@${github.context.actor} Only core maintainers can jump the queue. Please have a core maintainer jump the queue for you.`
                });
            }
        }
        return updateMergeQueue(queuedPrs);
    }
    if (prAttemptingToJoinQueue) {
        await addPrToQueue(pullRequest, queuePosition, skip_auto_merge);
    }
    const isFirstQueuePosition = queuePosition === 1 || pullRequest.labels.find(label => label.name === constants/* FIRST_QUEUED_PR_LABEL */.RB);
    if (isFirstQueuePosition) {
        await (0,prepare_queued_pr_for_merge.updatePrWithDefaultBranch)(pullRequest);
    }
    await (0,set_commit_status.setCommitStatus)({
        sha: pullRequest.head.sha,
        context: constants/* MERGE_QUEUE_STATUS */.Qw,
        state: isFirstQueuePosition ? 'success' : 'pending',
        description: isFirstQueuePosition ? 'This PR is next to merge.' : 'This PR is in line to merge.'
    });
    if (isFirstQueuePosition && slack_webhook_url && login) {
        await (0,notify_user/* notifyUser */.l)({
            login,
            pull_number: github.context.issue.number,
            slack_webhook_url,
            queuePosition
        });
    }
};
const removePrFromQueue = async (pullRequest) => {
    await (0,remove_label.removeLabelIfExists)(constants/* READY_FOR_MERGE_PR_LABEL */.ZV, pullRequest.number);
    const queueLabel = pullRequest.labels.find(label => label.name?.startsWith(constants/* QUEUED_FOR_MERGE_PREFIX */.KE))?.name;
    if (queueLabel) {
        await (0,remove_label.removeLabelIfExists)(queueLabel, pullRequest.number);
    }
    await (0,set_commit_status.setCommitStatus)({
        sha: pullRequest.head.sha,
        context: constants/* MERGE_QUEUE_STATUS */.Qw,
        state: 'pending',
        description: 'This PR is not in the merge queue.'
    });
    const queuedPrs = await getQueuedPullRequests();
    return updateMergeQueue(queuedPrs);
};
const addPrToQueue = async (pullRequest, queuePosition, skip_auto_merge) => {
    await octokit/* octokit */.A.issues.addLabels({
        labels: [`${constants/* QUEUED_FOR_MERGE_PREFIX */.KE} #${queuePosition}`],
        issue_number: github.context.issue.number,
        ...github.context.repo
    });
    if (skip_auto_merge == 'true') {
        core.info('Skipping auto merge per configuration.');
        return;
    }
    await enableAutoMerge(pullRequest.node_id);
};
const getQueuedPullRequests = async () => {
    const openPullRequests = await (0,paginate_open_pull_requests/* paginateAllOpenPullRequests */.U)();
    return openPullRequests.filter(pr => pr.labels.some(label => label.name === constants/* READY_FOR_MERGE_PR_LABEL */.ZV) &&
        pr.labels.some(label => label.name.startsWith(constants/* QUEUED_FOR_MERGE_PREFIX */.KE)));
};
const enableAutoMerge = async (pullRequestId, mergeMethod = 'SQUASH') => {
    try {
        await (0,octokit/* octokitGraphql */.n)(`
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
};
const githubEmailDocsLink = 'https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/changing-your-primary-email-address';


/***/ }),

/***/ 6546:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prepareQueuedPrForMerge: () => (/* binding */ prepareQueuedPrForMerge),
/* harmony export */   updatePrWithDefaultBranch: () => (/* binding */ updatePrWithDefaultBranch)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7242);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6590);
/* harmony import */ var _manage_merge_queue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4703);
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





const prepareQueuedPrForMerge = async () => {
    const { data } = await _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.pulls.list({
        state: 'open',
        per_page: 100,
        ..._actions_github__WEBPACK_IMPORTED_MODULE_2__.context.repo
    });
    const pullRequest = findNextPrToMerge(data);
    if (pullRequest) {
        return updatePrWithDefaultBranch(pullRequest);
    }
};
const findNextPrToMerge = (pullRequests) => pullRequests.find(pr => hasRequiredLabels(pr, [_constants__WEBPACK_IMPORTED_MODULE_1__/* .READY_FOR_MERGE_PR_LABEL */ .ZV, _constants__WEBPACK_IMPORTED_MODULE_1__/* .JUMP_THE_QUEUE_PR_LABEL */ .hU])) ??
    pullRequests.find(pr => hasRequiredLabels(pr, [_constants__WEBPACK_IMPORTED_MODULE_1__/* .READY_FOR_MERGE_PR_LABEL */ .ZV, _constants__WEBPACK_IMPORTED_MODULE_1__/* .FIRST_QUEUED_PR_LABEL */ .RB]));
const hasRequiredLabels = (pr, requiredLabels) => requiredLabels.every(mergeQueueLabel => pr.labels.some(label => label.name === mergeQueueLabel));
const updatePrWithDefaultBranch = async (pullRequest) => {
    if (pullRequest.head.user?.login && pullRequest.base.user?.login && pullRequest.head.user?.login !== pullRequest.base.user?.login) {
        try {
            // update fork default branch with upstream
            await _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.repos.mergeUpstream({
                ..._actions_github__WEBPACK_IMPORTED_MODULE_2__.context.repo,
                branch: pullRequest.base.repo.default_branch
            });
        }
        catch (error) {
            if (error.status === 409) {
                _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed('Attempt to update fork branch with upstream failed; conflict on default branch between fork and upstream.');
            }
            else
                _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed(error.message);
        }
    }
    try {
        await _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.repos.merge({
            base: pullRequest.head.ref,
            head: 'HEAD',
            ..._actions_github__WEBPACK_IMPORTED_MODULE_2__.context.repo
        });
    }
    catch (error) {
        const noEvictUponConflict = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('no_evict_upon_conflict');
        const githubError = error;
        if (githubError.status !== 409) {
            _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed(githubError.message);
            return;
        }
        if (noEvictUponConflict === 'true') {
            _actions_core__WEBPACK_IMPORTED_MODULE_0__.info('The first PR in the queue has a merge conflict. PR was not removed from the queue due to no_evict_upon_conflict input.');
            return;
        }
        await (0,_manage_merge_queue__WEBPACK_IMPORTED_MODULE_4__.removePrFromQueue)(pullRequest);
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed('The first PR in the queue has a merge conflict, and it was removed from the queue.');
    }
};


/***/ }),

/***/ 5598:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RemoveLabel: () => (/* binding */ RemoveLabel),
/* harmony export */   removeLabel: () => (/* binding */ removeLabel),
/* harmony export */   removeLabelIfExists: () => (/* binding */ removeLabelIfExists)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6590);
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




class RemoveLabel extends _types_generated__WEBPACK_IMPORTED_MODULE_3__/* .HelperInputs */ .m {
    label = '';
}
const removeLabel = async ({ label }) => removeLabelIfExists(label, _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.issue.number);
const removeLabelIfExists = async (labelName, issue_number) => {
    try {
        await _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit */ .A.issues.removeLabel({
            name: labelName,
            issue_number,
            ..._actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo
        });
    }
    catch (error) {
        if (error.status === 404) {
            _actions_core__WEBPACK_IMPORTED_MODULE_0__.info('Label is not present on PR.');
        }
    }
};


/***/ }),

/***/ 9250:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SetCommitStatus: () => (/* binding */ SetCommitStatus),
/* harmony export */   setCommitStatus: () => (/* binding */ setCommitStatus)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4366);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6590);
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





class SetCommitStatus extends _types_generated__WEBPACK_IMPORTED_MODULE_4__/* .HelperInputs */ .m {
    sha = '';
    context = '';
    state = '';
}
const setCommitStatus = async ({ sha, context, state, description, target_url, skip_if_already_set }) => {
    await (0,bluebird__WEBPACK_IMPORTED_MODULE_2__.map)(context.split('\n').filter(Boolean), async (context) => {
        if (skip_if_already_set === 'true') {
            const check_runs = await _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.checks.listForRef({
                ..._actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo,
                ref: sha
            });
            const run = check_runs.data.check_runs.find(({ name }) => name === context);
            const runCompletedAndIsValid = run?.status === 'completed' && (run?.conclusion === 'failure' || run?.conclusion === 'success');
            if (runCompletedAndIsValid) {
                _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`${context} already completed with a ${run.conclusion} conclusion.`);
                return;
            }
        }
        _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.repos.createCommitStatus({
            sha,
            context,
            state: state,
            description,
            target_url,
            ..._actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo
        });
    });
};


/***/ }),

/***/ 9190:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   l: () => (/* binding */ notifyUser)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7573);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6590);
/* harmony import */ var _helpers_get_email_on_user_profile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4862);
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





const notifyUser = async ({ login, pull_number, slack_webhook_url, queuePosition }) => {
    const email = await (0,_helpers_get_email_on_user_profile__WEBPACK_IMPORTED_MODULE_3__.getEmailOnUserProfile)({ login });
    if (!email) {
        return;
    }
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Notifying user ${login}...`);
    const { data: { title, html_url } } = await _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit */ .A.pulls.get({ pull_number, ..._actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo });
    const result = await axios__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.post(slack_webhook_url, {
        assignee: email,
        title,
        html_url,
        repo: _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo.repo,
        queuePosition
    });
    if (result.status !== 200) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.error(result.statusText);
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed(`User notification failed for login: ${login} and email: ${email}`);
    }
    return result;
};


/***/ }),

/***/ 3332:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   U: () => (/* binding */ paginateAllOpenPullRequests)
/* harmony export */ });
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6590);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);
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


const paginateAllOpenPullRequests = async (page = 1) => {
    const response = await _octokit__WEBPACK_IMPORTED_MODULE_0__/* .octokit */ .A.pulls.list({
        state: 'open',
        sort: 'updated',
        direction: 'desc',
        per_page: 100,
        page,
        ..._actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo
    });
    if (!response.data.length) {
        return [];
    }
    return response.data.concat(await paginateAllOpenPullRequests(page + 1));
};


/***/ })

};

//# sourceMappingURL=284.index.js.map