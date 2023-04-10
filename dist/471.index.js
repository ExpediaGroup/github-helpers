"use strict";
exports.id = 471;
exports.ids = [471];
exports.modules = {

/***/ 2471:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DeleteStaleBranches": () => (/* binding */ DeleteStaleBranches),
/* harmony export */   "deleteStaleBranches": () => (/* binding */ deleteStaleBranches)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(3476);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6161);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8710);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils_paginate_open_pull_requests__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5757);
/* harmony import */ var _utils_get_default_branch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(977);
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







class DeleteStaleBranches extends _types_generated__WEBPACK_IMPORTED_MODULE_6__/* .HelperInputs */ .s {
}
const deleteStaleBranches = ({ days = '30' } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const openPullRequests = yield (0,_utils_paginate_open_pull_requests__WEBPACK_IMPORTED_MODULE_4__/* .paginateAllOpenPullRequests */ .P)();
    const openPullRequestBranches = new Set(openPullRequests.map(pr => pr.head.ref));
    const allBranches = yield paginateAllUnprotectedBranches();
    const defaultBranch = yield (0,_utils_get_default_branch__WEBPACK_IMPORTED_MODULE_5__/* .getDefaultBranch */ ._)();
    const featureBranchesWithNoOpenPullRequest = allBranches.filter(({ name }) => !openPullRequestBranches.has(name) && name !== defaultBranch);
    const branchesWithUpdatedDates = yield (0,bluebird__WEBPACK_IMPORTED_MODULE_3__.map)(featureBranchesWithNoOpenPullRequest, ({ name, commit: { sha } }) => __awaiter(void 0, void 0, void 0, function* () {
        const { data: { committer: { date } } } = yield _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit.git.getCommit */ .KT.git.getCommit(Object.assign({ commit_sha: sha }, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo));
        return {
            name,
            date
        };
    }));
    const branchesToDelete = branchesWithUpdatedDates.filter(({ date }) => branchIsTooOld(date, days)).map(({ name }) => name);
    yield (0,bluebird__WEBPACK_IMPORTED_MODULE_3__.map)(branchesToDelete, (branch) => __awaiter(void 0, void 0, void 0, function* () {
        _actions_core__WEBPACK_IMPORTED_MODULE_1__.info(`Deleting branch ${branch}...`);
        yield _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit.git.deleteRef */ .KT.git.deleteRef(Object.assign({ ref: `heads/${branch}` }, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo));
    }));
});
const branchIsTooOld = (dateLastUpdated, daysThreshold) => {
    const lastUpdated = new Date(dateLastUpdated);
    const now = Date.now();
    const timeSinceLastUpdated = now - lastUpdated.getTime();
    const threshold = Number(daysThreshold) * 86400000;
    return timeSinceLastUpdated > threshold;
};
const paginateAllUnprotectedBranches = (page = 1) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit.repos.listBranches */ .KT.repos.listBranches(Object.assign({ protected: false, per_page: 100, page }, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo));
    if (!response.data.length) {
        return [];
    }
    return response.data.concat(yield paginateAllUnprotectedBranches(page + 1));
});


/***/ }),

/***/ 6161:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KT": () => (/* binding */ octokit),
/* harmony export */   "mC": () => (/* binding */ octokitRequest),
/* harmony export */   "ox": () => (/* binding */ octokitGraphql)
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

/***/ 977:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_": () => (/* binding */ getDefaultBranch)
/* harmony export */ });
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6161);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);
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


const getDefaultBranch = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data: { default_branch } } = yield _octokit__WEBPACK_IMPORTED_MODULE_0__/* .octokit.repos.get */ .KT.repos.get(Object.assign({}, _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo));
    return default_branch;
});


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
//# sourceMappingURL=471.index.js.map