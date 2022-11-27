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
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils_paginate_open_pull_requests__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5757);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8710);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _set_commit_status__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2209);
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








class CheckMergeSafety extends _types_generated__WEBPACK_IMPORTED_MODULE_7__/* .HelperInputs */ .s {
}
const checkMergeSafety = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    const isPrWorkflow = Boolean(_actions_github__WEBPACK_IMPORTED_MODULE_0__.context.issue.number);
    if (!isPrWorkflow) {
        return handlePushWorkflow(inputs);
    }
    const { data: pullRequest } = yield _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit.pulls.get */ .K.pulls.get(Object.assign({ pull_number: _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.issue.number }, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo));
    const isSafeToMerge = yield prIsSafeToMerge(pullRequest, inputs);
    if (!isSafeToMerge) {
        throw new Error();
    }
});
const handlePushWorkflow = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    const pullRequests = yield (0,_utils_paginate_open_pull_requests__WEBPACK_IMPORTED_MODULE_4__/* .paginateAllOpenPullRequests */ .P)();
    return (0,bluebird__WEBPACK_IMPORTED_MODULE_5__.map)(pullRequests, (pullRequest) => __awaiter(void 0, void 0, void 0, function* () {
        const isSafeToMerge = yield prIsSafeToMerge(pullRequest, inputs);
        yield (0,_set_commit_status__WEBPACK_IMPORTED_MODULE_6__.setCommitStatus)(Object.assign({ sha: pullRequest.head.sha, state: isSafeToMerge ? 'success' : 'failure', context: 'Merge Safety' }, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo));
    }));
});
const prIsSafeToMerge = (pullRequest, { paths, override_filter_paths, override_filter_globs }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { base: { repo: { default_branch } }, head: { ref } } = pullRequest;
    _actions_core__WEBPACK_IMPORTED_MODULE_3__.info(`ref: ${ref}`);
    _actions_core__WEBPACK_IMPORTED_MODULE_3__.info(`default_branch: ${default_branch}`);
    const { data: { files: filesWhichBranchIsBehindOn } } = yield _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit.repos.compareCommitsWithBasehead */ .K.repos.compareCommitsWithBasehead(Object.assign(Object.assign({}, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo), { basehead: `${ref}...${default_branch}` }));
    const fileNamesWhichBranchIsBehindOn = (_a = filesWhichBranchIsBehindOn === null || filesWhichBranchIsBehindOn === void 0 ? void 0 : filesWhichBranchIsBehindOn.map(file => file.filename)) !== null && _a !== void 0 ? _a : [];
    const shouldOverrideSafetyCheck = override_filter_globs
        ? micromatch__WEBPACK_IMPORTED_MODULE_2___default()(fileNamesWhichBranchIsBehindOn, override_filter_globs.split('\n')).length > 0
        : fileNamesWhichBranchIsBehindOn.some(changedFile => override_filter_paths === null || override_filter_paths === void 0 ? void 0 : override_filter_paths.split(/[\n,]/).includes(changedFile));
    if (shouldOverrideSafetyCheck) {
        _actions_core__WEBPACK_IMPORTED_MODULE_3__.error(`This branch has one or more outdated files that must be rebased on! Please update "${ref}" with the "${default_branch}" branch.`);
        return false;
    }
    const { data: { files: changedFiles } } = yield _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit.repos.compareCommitsWithBasehead */ .K.repos.compareCommitsWithBasehead(Object.assign(Object.assign({}, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo), { basehead: `${default_branch}...${ref}` }));
    const changedFileNames = changedFiles === null || changedFiles === void 0 ? void 0 : changedFiles.map(file => file.filename);
    const projectDirectories = paths === null || paths === void 0 ? void 0 : paths.split(/[\n,]/);
    const isUnsafeToMerge = projectDirectories === null || projectDirectories === void 0 ? void 0 : projectDirectories.some(dir => fileNamesWhichBranchIsBehindOn.some(file => file.includes(dir)) && (changedFileNames === null || changedFileNames === void 0 ? void 0 : changedFileNames.some(file => file.includes(dir))));
    if (isUnsafeToMerge) {
        _actions_core__WEBPACK_IMPORTED_MODULE_3__.error(`This branch has one or more outdated projects which are being changed in this PR. Please update "${ref}" with the "${default_branch}" branch.`);
        return false;
    }
    _actions_core__WEBPACK_IMPORTED_MODULE_3__.info(`The PR from branch ${ref} is safe to merge!`);
    return true;
});


/***/ }),

/***/ 2209:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SetCommitStatus": () => (/* binding */ SetCommitStatus),
/* harmony export */   "setCommitStatus": () => (/* binding */ setCommitStatus)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3476);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8710);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6161);
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




class SetCommitStatus extends _types_generated__WEBPACK_IMPORTED_MODULE_3__/* .HelperInputs */ .s {
    constructor() {
        super(...arguments);
        this.sha = '';
        this.context = '';
        this.state = '';
    }
}
const setCommitStatus = ({ sha, context, state, description, target_url }) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0,bluebird__WEBPACK_IMPORTED_MODULE_1__.map)(context.split('\n').filter(Boolean), context => _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit.repos.createCommitStatus */ .K.repos.createCommitStatus(Object.assign({ sha,
        context, state: state, description,
        target_url }, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo)));
});


/***/ }),

/***/ 6161:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "K": () => (/* binding */ octokit),
/* harmony export */   "o": () => (/* binding */ octokitGraphql)
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
const { rest: octokit, graphql: octokitGraphql } = (0,_actions_github__WEBPACK_IMPORTED_MODULE_2__.getOctokit)(githubToken, { request: { fetch: _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__ } });


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
    const response = yield _octokit__WEBPACK_IMPORTED_MODULE_0__/* .octokit.pulls.list */ .K.pulls.list(Object.assign({ state: 'open', sort: 'updated', direction: 'desc', per_page: 100, page }, _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo));
    if (!response.data.length) {
        return [];
    }
    return response.data.concat(yield paginateAllOpenPullRequests(page + 1));
});


/***/ })

};
;
//# sourceMappingURL=180.index.js.map