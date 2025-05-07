export const id = 338;
export const ids = [338];
export const modules = {

/***/ 8338:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetChangedFiles: () => (/* binding */ GetChangedFiles),
/* harmony export */   getChangedFiles: () => (/* binding */ getChangedFiles)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_get_changed_filepaths__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6039);
/* harmony import */ var _utils_merge_queue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5323);
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




class GetChangedFiles extends _types_generated__WEBPACK_IMPORTED_MODULE_3__/* .HelperInputs */ .m {
}
const getChangedFiles = async ({ pattern, delimiter = ',', ignore_deleted }) => {
    const pullNumber = _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.eventName === 'merge_group' ? (0,_utils_merge_queue__WEBPACK_IMPORTED_MODULE_2__/* .getPrNumberFromMergeQueueRef */ .M)() : _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.issue.number;
    const filePaths = await (0,_utils_get_changed_filepaths__WEBPACK_IMPORTED_MODULE_1__/* .getChangedFilepaths */ .t)(pullNumber, Boolean(ignore_deleted));
    const filteredFilePaths = pattern ? filePaths.filter(fileName => fileName.match(pattern)) : filePaths;
    return filteredFilePaths.join(delimiter);
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

/***/ 6039:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   t: () => (/* binding */ getChangedFilepaths)
/* harmony export */ });
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


const getChangedFilepaths = async (pull_number, ignore_deleted) => {
    const changedFiles = await paginateAllChangedFilepaths(pull_number);
    const renamedPreviousFilenames = changedFiles
        .filter(({ status }) => status === 'renamed')
        .map(({ previous_filename }) => previous_filename)
        .filter(Boolean); // GitHub should always include previous_filename for renamed files, but just in case
    const processedFilenames = (ignore_deleted ? changedFiles.filter(({ status }) => status !== 'removed') : changedFiles).map(({ filename }) => filename);
    return processedFilenames.concat(renamedPreviousFilenames);
};
const paginateAllChangedFilepaths = async (pull_number, page = 1) => {
    const response = await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.pulls.listFiles({
        pull_number,
        per_page: 100,
        page,
        ..._actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo
    });
    if (!response.data.length) {
        return [];
    }
    return response.data.concat(await paginateAllChangedFilepaths(pull_number, page + 1));
};


/***/ }),

/***/ 5323:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: () => (/* binding */ getPrNumberFromMergeQueueRef),
/* harmony export */   T: () => (/* binding */ getMergeQueueCommitHashes)
/* harmony export */ });
/* harmony import */ var _paginate_all_branches__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9615);
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


const getMergeQueueCommitHashes = async () => {
    const branches = await (0,_paginate_all_branches__WEBPACK_IMPORTED_MODULE_0__/* .paginateAllBranches */ .h)();
    const mergeQueueBranches = branches.filter(branch => branch.name.startsWith('gh-readonly-queue/'));
    return mergeQueueBranches.map(branch => branch.commit.sha);
};
const getPrNumberFromMergeQueueRef = () => {
    const prNumber = Number(_actions_github__WEBPACK_IMPORTED_MODULE_1__.context.ref
        .split('/')
        .find(part => part.includes('pr-'))
        ?.match(/\d+/)?.[0]);
    if (isNaN(prNumber)) {
        throw new Error('Could not find PR number in merge queue ref.');
    }
    return prNumber;
};


/***/ }),

/***/ 9615:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   h: () => (/* binding */ paginateAllBranches)
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


const paginateAllBranches = async ({ protectedBranches, page = 1 } = {}) => {
    const response = await _octokit__WEBPACK_IMPORTED_MODULE_0__/* .octokit */ .A.repos.listBranches({
        protected: protectedBranches,
        per_page: 100,
        page,
        ..._actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo
    });
    if (!response.data.length) {
        return [];
    }
    return [...response.data, ...(await paginateAllBranches({ protectedBranches, page: page + 1 }))];
};


/***/ })

};

//# sourceMappingURL=338.index.js.map