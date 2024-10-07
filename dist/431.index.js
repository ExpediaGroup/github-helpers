export const id = 431;
export const ids = [431,250];
export const modules = {

/***/ 5431:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CheckMergeSafety: () => (/* binding */ CheckMergeSafety),
/* harmony export */   checkMergeSafety: () => (/* binding */ checkMergeSafety)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6590);
/* harmony import */ var micromatch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8785);
/* harmony import */ var micromatch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(micromatch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_paginate_open_pull_requests__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3332);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4366);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _set_commit_status__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9250);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_6__);
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








const maxBranchNameLength = 50;
class CheckMergeSafety extends _types_generated__WEBPACK_IMPORTED_MODULE_7__/* .HelperInputs */ .m {
}
const checkMergeSafety = async (inputs) => {
    const isPrWorkflow = Boolean(_actions_github__WEBPACK_IMPORTED_MODULE_0__.context.issue.number);
    if (!isPrWorkflow) {
        return handlePushWorkflow(inputs);
    }
    const { data: pullRequest } = await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.pulls.get({ pull_number: _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.issue.number, ..._actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo });
    const { state, message } = await setMergeSafetyStatus(pullRequest, inputs);
    if (state === 'failure') {
        _actions_core__WEBPACK_IMPORTED_MODULE_6__.setFailed(message);
    }
};
const setMergeSafetyStatus = async (pullRequest, { context = 'Merge Safety', ...inputs }) => {
    const { state, message } = await getMergeSafetyStateAndMessage(pullRequest, inputs);
    const hasExistingFailureStatus = await checkForExistingFailureStatus(pullRequest, context);
    if (hasExistingFailureStatus && state === 'failure') {
        const { head: { ref, user: { login: username } } } = pullRequest;
        const truncatedRef = ref.length > maxBranchNameLength ? `${ref.substring(0, maxBranchNameLength)}...` : ref;
        const truncatedBranchName = `${username}:${truncatedRef}`;
        _actions_core__WEBPACK_IMPORTED_MODULE_6__.info(`Found existing failure status for ${truncatedBranchName}, skipping setting new status`);
    }
    else {
        await (0,_set_commit_status__WEBPACK_IMPORTED_MODULE_5__.setCommitStatus)({
            sha: pullRequest.head.sha,
            state,
            context,
            description: message,
            ..._actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo
        });
    }
    return { state, message };
};
const handlePushWorkflow = async (inputs) => {
    const pullRequests = await (0,_utils_paginate_open_pull_requests__WEBPACK_IMPORTED_MODULE_3__/* .paginateAllOpenPullRequests */ .U)();
    const filteredPullRequests = pullRequests.filter(({ base, draft }) => !draft && base.ref === base.repo.default_branch);
    await (0,bluebird__WEBPACK_IMPORTED_MODULE_4__.map)(filteredPullRequests, pullRequest => setMergeSafetyStatus(pullRequest, inputs));
};
const checkForExistingFailureStatus = async (pullRequest, context) => {
    const { data } = await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.repos.getCombinedStatusForRef({
        ..._actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo,
        ref: pullRequest.head.sha
    });
    if (data.state === 'failure') {
        const existingContext = data.statuses.find(status => status.context === context);
        return Boolean(existingContext);
    }
    return false;
};
const getMergeSafetyStateAndMessage = async (pullRequest, { paths, ignore_globs, override_filter_paths, override_filter_globs }) => {
    const { base: { repo: { default_branch, owner: { login: baseOwner } } }, head: { ref, user: { login: username } } } = pullRequest;
    const branchName = `${username}:${ref}`;
    const truncatedRef = ref.length > maxBranchNameLength ? `${ref.substring(0, maxBranchNameLength)}...` : ref;
    const truncatedBranchName = `${username}:${truncatedRef}`;
    const { data: { files: filesWhichBranchIsBehindOn } } = await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.repos.compareCommitsWithBasehead({
        ..._actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo,
        basehead: `${branchName}...${baseOwner}:${default_branch}`
    });
    const fileNamesWhichBranchIsBehindOn = filesWhichBranchIsBehindOn?.map(file => file.filename) ?? [];
    const globalFilesOutdatedOnBranch = override_filter_globs
        ? micromatch__WEBPACK_IMPORTED_MODULE_2___default()(fileNamesWhichBranchIsBehindOn, override_filter_globs.split(/[\n,]/))
        : override_filter_paths
            ? fileNamesWhichBranchIsBehindOn.filter(changedFile => override_filter_paths.split(/[\n,]/).includes(changedFile))
            : [];
    if (globalFilesOutdatedOnBranch.length) {
        _actions_core__WEBPACK_IMPORTED_MODULE_6__.error(buildErrorMessage(globalFilesOutdatedOnBranch, 'global files', truncatedBranchName));
        return {
            state: 'failure',
            message: `This branch has one or more outdated global files. Please update with ${default_branch}.`
        };
    }
    const { data: { files: changedFiles } } = await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.repos.compareCommitsWithBasehead({
        ..._actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo,
        basehead: `${baseOwner}:${default_branch}...${branchName}`
    });
    const changedFileNames = changedFiles?.map(file => file.filename);
    const changedFilesToIgnore = changedFileNames && ignore_globs ? micromatch__WEBPACK_IMPORTED_MODULE_2___default()(changedFileNames, ignore_globs.split(/[\n,]/)) : [];
    const filteredFileNames = changedFileNames?.filter(file => !changedFilesToIgnore.includes(file));
    const allProjectDirectories = paths?.split(/[\n,]/);
    const changedProjectsOutdatedOnBranch = allProjectDirectories?.filter(dir => fileNamesWhichBranchIsBehindOn.some(file => file.includes(dir)) && filteredFileNames?.some(file => file.includes(dir)));
    if (changedProjectsOutdatedOnBranch?.length) {
        _actions_core__WEBPACK_IMPORTED_MODULE_6__.error(buildErrorMessage(changedProjectsOutdatedOnBranch, 'projects', truncatedBranchName));
        return {
            state: 'failure',
            message: `This branch has one or more outdated projects. Please update with ${default_branch}.`
        };
    }
    const safeMessage = buildSuccessMessage(truncatedBranchName);
    _actions_core__WEBPACK_IMPORTED_MODULE_6__.info(safeMessage);
    return {
        state: 'success',
        message: safeMessage
    };
};
const buildErrorMessage = (paths, pathType, branchName) => `
The following ${pathType} are outdated on branch ${branchName}

${paths.map(path => `* ${path}`).join('\n')}
`;
const buildSuccessMessage = (branchName) => `Branch ${branchName} is safe to merge!`;


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
    constructor() {
        super(...arguments);
        this.sha = '';
        this.context = '';
        this.state = '';
    }
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

//# sourceMappingURL=431.index.js.map