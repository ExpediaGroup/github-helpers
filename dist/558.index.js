export const id = 558;
export const ids = [558,720,280];
export const modules = {

/***/ 7242:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   E$: () => (/* binding */ PRODUCTION_ENVIRONMENT),
/* harmony export */   E3: () => (/* binding */ DEFAULT_PIPELINE_DESCRIPTION),
/* harmony export */   E5: () => (/* binding */ DEFAULT_PR_TITLE_REGEX),
/* harmony export */   In: () => (/* binding */ ALMOST_OVERDUE_ISSUE),
/* harmony export */   KE: () => (/* binding */ QUEUED_FOR_MERGE_PREFIX),
/* harmony export */   Md: () => (/* binding */ DEFAULT_PIPELINE_STATUS),
/* harmony export */   Nj: () => (/* binding */ OVERDUE_ISSUE),
/* harmony export */   PX: () => (/* binding */ SECONDS_IN_A_DAY),
/* harmony export */   Qc: () => (/* binding */ LATE_REVIEW),
/* harmony export */   Qw: () => (/* binding */ MERGE_QUEUE_STATUS),
/* harmony export */   RB: () => (/* binding */ FIRST_QUEUED_PR_LABEL),
/* harmony export */   XD: () => (/* binding */ PEER_APPROVED_PR_LABEL),
/* harmony export */   ZV: () => (/* binding */ READY_FOR_MERGE_PR_LABEL),
/* harmony export */   hU: () => (/* binding */ JUMP_THE_QUEUE_PR_LABEL),
/* harmony export */   mR: () => (/* binding */ PRIORITY_TO_DAYS_MAP),
/* harmony export */   uJ: () => (/* binding */ CORE_APPROVED_PR_LABEL),
/* harmony export */   zh: () => (/* binding */ PRIORITY_LABELS)
/* harmony export */ });
/* unused harmony exports PRIORITY_1, PRIORITY_2, PRIORITY_3, PRIORITY_4, COPYRIGHT_HEADER */
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
const SECONDS_IN_A_DAY = 86400000;
const DEFAULT_PIPELINE_STATUS = 'Pipeline Status';
const DEFAULT_PIPELINE_DESCRIPTION = 'Pipeline clear.';
const PRODUCTION_ENVIRONMENT = 'production';
const LATE_REVIEW = 'Late Review';
const OVERDUE_ISSUE = 'Overdue';
const ALMOST_OVERDUE_ISSUE = 'Due Soon';
const PRIORITY_1 = 'Priority: Critical';
const PRIORITY_2 = 'Priority: High';
const PRIORITY_3 = 'Priority: Medium';
const PRIORITY_4 = 'Priority: Low';
const PRIORITY_LABELS = [PRIORITY_1, PRIORITY_2, PRIORITY_3, PRIORITY_4];
const PRIORITY_TO_DAYS_MAP = {
    [PRIORITY_1]: 2,
    [PRIORITY_2]: 14,
    [PRIORITY_3]: 45,
    [PRIORITY_4]: 90
};
const CORE_APPROVED_PR_LABEL = 'CORE APPROVED';
const PEER_APPROVED_PR_LABEL = 'PEER APPROVED';
const READY_FOR_MERGE_PR_LABEL = 'READY FOR MERGE';
const MERGE_QUEUE_STATUS = 'QUEUE CHECKER';
const QUEUED_FOR_MERGE_PREFIX = 'QUEUED FOR MERGE';
const FIRST_QUEUED_PR_LABEL = `${QUEUED_FOR_MERGE_PREFIX} #1`;
const JUMP_THE_QUEUE_PR_LABEL = 'JUMP THE QUEUE';
const DEFAULT_PR_TITLE_REGEX = '^(build|ci|chore|docs|feat|fix|perf|refactor|style|test|revert|Revert|BREAKING CHANGE)((.*))?: .+$';
const COPYRIGHT_HEADER = (/* unused pure expression or super */ null && (`/*
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
*/`));


/***/ }),

/***/ 4720:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClosePr: () => (/* binding */ ClosePr),
/* harmony export */   closePr: () => (/* binding */ closePr)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6590);
/* harmony import */ var _create_pr_comment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9280);
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




class ClosePr extends _types_generated__WEBPACK_IMPORTED_MODULE_3__/* .HelperInputs */ .m {
}
const closePr = async ({ body, pull_number, repo_name, repo_owner_name } = {}) => {
    if ((repo_name || repo_owner_name) && !pull_number) {
        throw new Error('pull_number is required when repo_name or repo_owner_name is provided');
    }
    if (body) {
        await (0,_create_pr_comment__WEBPACK_IMPORTED_MODULE_2__.createPrComment)({ body, pull_number, repo_name, repo_owner_name });
    }
    return _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.pulls.update({
        pull_number: pull_number ? Number(pull_number) : _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.issue.number,
        repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.repo,
        owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.owner,
        state: 'closed'
    });
};


/***/ }),

/***/ 9280:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CreatePrComment: () => (/* binding */ CreatePrComment),
/* harmony export */   createPrComment: () => (/* binding */ createPrComment)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6590);
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



class CreatePrComment extends _types_generated__WEBPACK_IMPORTED_MODULE_2__/* .HelperInputs */ .m {
    body = '';
}
const emptyResponse = { data: [] };
const getFirstPrByCommit = async (sha, repo_name, repo_owner_name) => {
    const prs = (sha &&
        (await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.repos.listPullRequestsAssociatedWithCommit({
            commit_sha: sha,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.owner
        }))) ||
        emptyResponse;
    return prs.data.find(Boolean)?.number;
};
const getCommentByUser = async (login, pull_number, repo_name, repo_owner_name) => {
    const comments = (login &&
        (await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.issues.listComments({
            issue_number: pull_number ? Number(pull_number) : _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.issue.number,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.owner
        }))) ||
        emptyResponse;
    return comments.data.find(comment => comment?.user?.login === login)?.id;
};
const createPrComment = async ({ body, sha, login, pull_number, repo_name, repo_owner_name }) => {
    const defaultPrNumber = _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.issue.number;
    if (!sha && !login) {
        return _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.issues.createComment({
            body,
            issue_number: pull_number ? Number(pull_number) : defaultPrNumber,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.owner
        });
    }
    const prNumber = (await getFirstPrByCommit(sha, repo_name, repo_owner_name)) ?? (pull_number ? Number(pull_number) : defaultPrNumber);
    const commentId = await getCommentByUser(login, pull_number, repo_name, repo_owner_name);
    if (commentId) {
        return _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.issues.updateComment({
            comment_id: commentId,
            body,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.owner
        });
    }
    else {
        return _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.issues.createComment({
            body,
            issue_number: prNumber,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.owner
        });
    }
};


/***/ }),

/***/ 9558:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StalePrs: () => (/* binding */ StalePrs),
/* harmony export */   stalePrs: () => (/* binding */ stalePrs)
/* harmony export */ });
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8428);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6590);
/* harmony import */ var _utils_paginate_open_pull_requests__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3332);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7242);
/* harmony import */ var _create_pr_comment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9280);
/* harmony import */ var _close_pr__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(4720);
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








class StalePrs extends _types_generated__WEBPACK_IMPORTED_MODULE_7__/* .HelperInputs */ .m {
}
const stalePrs = async ({ days = '30', exempt_labels = '', stale_label = 'stale', close_label = '', stale_comment = 'This pull request has been automatically marked as stale because it has not had recent activity. It will be closed if no further activity occurs.', close_comment = 'This pull request has been automatically closed due to inactivity.', operations_per_run = '30', ascending = 'false', only_labels = '', exempt_authors = '', exempt_draft_pr = 'true', remove_stale_when_updated = 'true', days_before_close = '' } = {}) => {
    const staleDays = Number(days);
    const maxOperations = Number(operations_per_run);
    const isAscending = ascending.toLowerCase() === 'true';
    const exemptDraftPr = exempt_draft_pr.toLowerCase() === 'true';
    const removeStaleWhenUpdated = remove_stale_when_updated.toLowerCase() === 'true';
    const daysBeforeClose = days_before_close ? Number(days_before_close) : null;
    const exemptLabelsList = exempt_labels
        .split(',')
        .map(label => label.trim())
        .filter(Boolean);
    const onlyLabelsList = only_labels
        .split(',')
        .map(label => label.trim())
        .filter(Boolean);
    const exemptAuthorsList = exempt_authors
        .split(',')
        .map(author => author.trim())
        .filter(Boolean);
    _actions_core__WEBPACK_IMPORTED_MODULE_1__.info(`Checking for stale PRs older than ${staleDays} days...`);
    const openPullRequests = await (0,_utils_paginate_open_pull_requests__WEBPACK_IMPORTED_MODULE_3__/* .paginateAllOpenPullRequests */ .U)();
    // Sort PRs by updated date
    openPullRequests.sort((a, b) => {
        const dateA = new Date(a.updated_at).getTime();
        const dateB = new Date(b.updated_at).getTime();
        return isAscending ? dateA - dateB : dateB - dateA;
    });
    // Filter PRs based on criteria
    const candidatePrs = openPullRequests.filter(pr => {
        // Skip draft PRs if configured
        if (exemptDraftPr && pr.draft) {
            return false;
        }
        // Skip PRs from exempt authors
        if (exemptAuthorsList.length > 0 && exemptAuthorsList.includes(pr.user?.login || '')) {
            return false;
        }
        return true;
    });
    let operationsCount = 0;
    const processedPrs = [];
    // First pass: Remove stale labels from recently updated PRs
    if (removeStaleWhenUpdated) {
        const stalePrs = candidatePrs.filter(pr => {
            const prLabels = pr.labels?.map(label => (typeof label === 'string' ? label : label.name)) || [];
            return prLabels.includes(stale_label);
        });
        for (const pr of stalePrs) {
            if (operationsCount >= maxOperations)
                break;
            const daysSinceUpdate = getDaysSinceLastUpdate(pr.updated_at);
            // If PR was updated recently (less than stale days), remove stale label
            if (daysSinceUpdate < staleDays) {
                _actions_core__WEBPACK_IMPORTED_MODULE_1__.info(`Removing stale label from PR #${pr.number} (recently updated: ${daysSinceUpdate} days ago)`);
                try {
                    await _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit */ .A.issues.removeLabel({
                        ..._actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo,
                        issue_number: pr.number,
                        name: stale_label
                    });
                }
                catch {
                    // Ignore if label doesn't exist
                }
                processedPrs.push({ number: pr.number, action: 'unstaled', reason: 'recently updated' });
                operationsCount++;
            }
        }
    }
    for (const pr of candidatePrs) {
        if (operationsCount >= maxOperations) {
            break;
        }
        const prLabels = pr.labels?.map(label => (typeof label === 'string' ? label : label.name)) || [];
        // Check if PR has exempt labels
        if (exemptLabelsList.length > 0 && exemptLabelsList.some(label => prLabels.includes(label))) {
            processedPrs.push({ number: pr.number, action: 'skipped', reason: 'exempt label' });
            continue;
        }
        // Check if PR should only be processed if it has specific labels
        if (onlyLabelsList.length > 0 && !onlyLabelsList.some(label => prLabels.includes(label))) {
            processedPrs.push({ number: pr.number, action: 'skipped', reason: 'missing required label' });
            continue;
        }
        const daysSinceUpdate = getDaysSinceLastUpdate(pr.updated_at);
        const isStale = daysSinceUpdate >= staleDays;
        const hasStaleLabel = prLabels.includes(stale_label);
        const hasCloseLabel = close_label && prLabels.includes(close_label);
        // Check if PR should be closed based on days_before_close
        const shouldAutoClose = daysBeforeClose && hasStaleLabel && daysSinceUpdate >= staleDays + daysBeforeClose;
        if (!isStale && !hasStaleLabel) {
            processedPrs.push({ number: pr.number, action: 'skipped', reason: 'not stale' });
            continue;
        }
        // Auto-close stale PRs that have exceeded the close threshold
        if (shouldAutoClose) {
            _actions_core__WEBPACK_IMPORTED_MODULE_1__.info(`Auto-closing stale PR #${pr.number} (stale for ${daysSinceUpdate - staleDays} days)`);
            await (0,_close_pr__WEBPACK_IMPORTED_MODULE_6__.closePr)({
                body: close_comment,
                pull_number: pr.number.toString()
            });
            processedPrs.push({ number: pr.number, action: 'closed', reason: 'auto-close after stale period' });
            operationsCount++;
            continue;
        }
        // If PR has close label, close it
        if (hasCloseLabel) {
            _actions_core__WEBPACK_IMPORTED_MODULE_1__.info(`Closing PR #${pr.number} due to close label...`);
            await (0,_close_pr__WEBPACK_IMPORTED_MODULE_6__.closePr)({
                body: close_comment,
                pull_number: pr.number.toString()
            });
            processedPrs.push({ number: pr.number, action: 'closed', reason: 'close label' });
            operationsCount++;
            continue;
        }
        // If PR is stale but doesn't have stale label, add it and comment
        if (isStale && !hasStaleLabel) {
            _actions_core__WEBPACK_IMPORTED_MODULE_1__.info(`Marking PR #${pr.number} as stale (${daysSinceUpdate} days old)...`);
            // Add stale label
            await _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit */ .A.issues.addLabels({
                ..._actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo,
                issue_number: pr.number,
                labels: [stale_label]
            });
            // Add stale comment
            if (stale_comment) {
                await (0,_create_pr_comment__WEBPACK_IMPORTED_MODULE_5__.createPrComment)({
                    body: stale_comment,
                    pull_number: pr.number.toString()
                });
            }
            processedPrs.push({ number: pr.number, action: 'staled' });
            operationsCount++;
        }
    }
    const summary = {
        total_processed: processedPrs.length,
        staled: processedPrs.filter(pr => pr.action === 'staled').length,
        closed: processedPrs.filter(pr => pr.action === 'closed').length,
        skipped: processedPrs.filter(pr => pr.action === 'skipped').length,
        unstaled: processedPrs.filter(pr => pr.action === 'unstaled').length,
        operations_performed: operationsCount
    };
    _actions_core__WEBPACK_IMPORTED_MODULE_1__.info(`Stale PR processing complete: ${JSON.stringify(summary)}`);
    return {
        summary,
        processed_prs: processedPrs
    };
};
const getDaysSinceLastUpdate = (updatedAt) => {
    const lastUpdated = new Date(updatedAt);
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated.getTime();
    return Math.floor(timeSinceLastUpdate / _constants__WEBPACK_IMPORTED_MODULE_4__/* .SECONDS_IN_A_DAY */ .PX);
};


/***/ }),

/***/ 6590:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ octokit),
/* harmony export */   n: () => (/* binding */ octokitGraphql)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1806);
/* harmony import */ var _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_2__);
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



const githubToken = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('github_token', { required: true });
const { rest: octokit, graphql: octokitGraphql } = (0,_actions_github__WEBPACK_IMPORTED_MODULE_2__.getOctokit)(githubToken, { request: { fetch: _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__ } });


/***/ }),

/***/ 8428:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ HelperInputs)
/* harmony export */ });
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
class HelperInputs {
}


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

//# sourceMappingURL=558.index.js.map