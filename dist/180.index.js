"use strict";
exports.id = 180;
exports.ids = [180,209];
exports.modules = {

/***/ 2180:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CheckMergeSafety": () => (/* binding */ CheckMergeSafety),
/* harmony export */   "checkMergeSafety": () => (/* binding */ checkMergeSafety)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(3476);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6161);
/* harmony import */ var micromatch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6228);
/* harmony import */ var micromatch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(micromatch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_paginate_open_pull_requests__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5757);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8710);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _set_commit_status__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2209);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2186);
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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};








class CheckMergeSafety extends _types_generated__WEBPACK_IMPORTED_MODULE_7__/* .HelperInputs */ .s {
}
const checkMergeSafety = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    const isPrWorkflow = Boolean(_actions_github__WEBPACK_IMPORTED_MODULE_0__.context.issue.number);
    if (!isPrWorkflow) {
        return handlePushWorkflow(inputs);
    }
    const { data: pullRequest } = yield _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit.pulls.get */ .KT.pulls.get(Object.assign({ pull_number: _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.issue.number }, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo));
    const { state, message } = yield setMergeSafetyStatus(pullRequest, inputs);
    if (state === 'failure') {
        _actions_core__WEBPACK_IMPORTED_MODULE_6__.setFailed(message);
    }
});
const setMergeSafetyStatus = (pullRequest, _a) => __awaiter(void 0, void 0, void 0, function* () {
    var { context = 'Merge Safety' } = _a, inputs = __rest(_a, ["context"]);
    const { state, message } = yield getMergeSafetyStateAndMessage(pullRequest, inputs);
    yield (0,_set_commit_status__WEBPACK_IMPORTED_MODULE_5__.setCommitStatus)(Object.assign({ sha: pullRequest.head.sha, state,
        context, description: message }, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo));
    return { state, message };
});
const handlePushWorkflow = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    const pullRequests = yield (0,_utils_paginate_open_pull_requests__WEBPACK_IMPORTED_MODULE_3__/* .paginateAllOpenPullRequests */ .P)();
    const filteredPullRequests = pullRequests.filter(({ base, draft }) => !draft && base.ref === base.repo.default_branch);
    yield (0,bluebird__WEBPACK_IMPORTED_MODULE_4__.map)(filteredPullRequests, pullRequest => setMergeSafetyStatus(pullRequest, inputs));
});
const getMergeSafetyStateAndMessage = (pullRequest, { paths, ignore_globs, override_filter_paths, override_filter_globs }) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { base: { repo: { default_branch, owner: { login: baseOwner } } }, head: { ref, user: { login: username } } } = pullRequest;
    const maxBranchNameLength = 50;
    const branchName = `${username}:${ref}`;
    const truncatedRef = ref.length > maxBranchNameLength ? `${ref.substring(0, maxBranchNameLength)}...` : ref;
    const truncatedBranchName = `${username}:${truncatedRef}`;
    const { data: { files: filesWhichBranchIsBehindOn } } = yield _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit.repos.compareCommitsWithBasehead */ .KT.repos.compareCommitsWithBasehead(Object.assign(Object.assign({}, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo), { basehead: `${branchName}...${baseOwner}:${default_branch}` }));
    const fileNamesWhichBranchIsBehindOn = (_b = filesWhichBranchIsBehindOn === null || filesWhichBranchIsBehindOn === void 0 ? void 0 : filesWhichBranchIsBehindOn.map(file => file.filename)) !== null && _b !== void 0 ? _b : [];
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
    const { data: { files: changedFiles } } = yield _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit.repos.compareCommitsWithBasehead */ .KT.repos.compareCommitsWithBasehead(Object.assign(Object.assign({}, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo), { basehead: `${baseOwner}:${default_branch}...${branchName}` }));
    const changedFileNames = changedFiles === null || changedFiles === void 0 ? void 0 : changedFiles.map(file => file.filename);
    const changedFilesToIgnore = changedFileNames && ignore_globs ? micromatch__WEBPACK_IMPORTED_MODULE_2___default()(changedFileNames, ignore_globs.split(/[\n,]/)) : [];
    const filteredFileNames = changedFileNames === null || changedFileNames === void 0 ? void 0 : changedFileNames.filter(file => !changedFilesToIgnore.includes(file));
    const allProjectDirectories = paths === null || paths === void 0 ? void 0 : paths.split(/[\n,]/);
    const changedProjectsOutdatedOnBranch = allProjectDirectories === null || allProjectDirectories === void 0 ? void 0 : allProjectDirectories.filter(dir => fileNamesWhichBranchIsBehindOn.some(file => file.includes(dir)) && (filteredFileNames === null || filteredFileNames === void 0 ? void 0 : filteredFileNames.some(file => file.includes(dir))));
    if (changedProjectsOutdatedOnBranch === null || changedProjectsOutdatedOnBranch === void 0 ? void 0 : changedProjectsOutdatedOnBranch.length) {
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
});
const buildErrorMessage = (paths, pathType, branchName) => `
The following ${pathType} are outdated on branch ${branchName}

${paths.map(path => `* ${path}`).join('\n')}
`;
const buildSuccessMessage = (branchName) => `Branch ${branchName} is safe to merge!`;


/***/ }),

/***/ 2209:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SetCommitStatus": () => (/* binding */ SetCommitStatus),
/* harmony export */   "setCommitStatus": () => (/* binding */ setCommitStatus)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3476);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8710);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6161);
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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





class SetCommitStatus extends _types_generated__WEBPACK_IMPORTED_MODULE_4__/* .HelperInputs */ .s {
    constructor() {
        super(...arguments);
        this.sha = '';
        this.context = '';
        this.state = '';
    }
}
const setCommitStatus = ({ sha, context, state, description, target_url, skip_if_already_set }) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0,bluebird__WEBPACK_IMPORTED_MODULE_2__.map)(context.split('\n').filter(Boolean), (context) => __awaiter(void 0, void 0, void 0, function* () {
        if (skip_if_already_set === 'true') {
            const check_runs = yield _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit.checks.listForRef */ .KT.checks.listForRef(Object.assign(Object.assign({}, _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo), { ref: sha }));
            const run = check_runs.data.check_runs.find(({ name }) => name === context);
            const runCompletedAndIsValid = (run === null || run === void 0 ? void 0 : run.status) === 'completed' && ((run === null || run === void 0 ? void 0 : run.conclusion) === 'failure' || (run === null || run === void 0 ? void 0 : run.conclusion) === 'success');
            if (runCompletedAndIsValid) {
                _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`${context} already completed with a ${run.conclusion} conclusion.`);
                return;
            }
        }
        _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit.repos.createCommitStatus */ .KT.repos.createCommitStatus(Object.assign({ sha,
            context, state: state, description,
            target_url }, _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo));
    }));
});


/***/ }),

/***/ 6161:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KT": () => (/* binding */ octokit),
/* harmony export */   "ox": () => (/* binding */ octokitGraphql),
/* harmony export */   "mC": () => (/* binding */ octokitRequest)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3006);
/* harmony import */ var _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5438);
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
const { rest: octokit, graphql: octokitGraphql, request: octokitRequest } = (0,_actions_github__WEBPACK_IMPORTED_MODULE_2__.getOctokit)(githubToken, { request: { fetch: _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__ } });


/***/ }),

/***/ 3476:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "s": () => (/* binding */ HelperInputs)
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

/***/ 5757:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "P": () => (/* binding */ paginateAllOpenPullRequests)
/* harmony export */ });
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6161);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5438);
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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const paginateAllOpenPullRequests = (page = 1) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield _octokit__WEBPACK_IMPORTED_MODULE_0__/* .octokit.pulls.list */ .KT.pulls.list(Object.assign({ state: 'open', sort: 'updated', direction: 'desc', per_page: 100, page }, _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo));
    if (!response.data.length) {
        return [];
    }
    return response.data.concat(yield paginateAllOpenPullRequests(page + 1));
});


/***/ })

};
;
//# sourceMappingURL=180.index.js.map