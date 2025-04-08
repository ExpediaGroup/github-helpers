export const id = 654;
export const ids = [654];
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
/* harmony export */   r0: () => (/* binding */ GITHUB_OPTIONS),
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
// These extra headers are for experimental API features on Github Enterprise. See https://docs.github.com/en/enterprise-server@3.0/rest/overview/api-previews for details.
const PREVIEWS = ['ant-man', 'flash', 'groot', 'inertia', 'starfox'];
const GITHUB_OPTIONS = {
    headers: {
        accept: PREVIEWS.map(preview => `application/vnd.github.${preview}-preview+json`).join()
    }
};
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

/***/ 8654:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FilterPaths: () => (/* binding */ FilterPaths),
/* harmony export */   filterPaths: () => (/* binding */ filterPaths)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var micromatch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8785);
/* harmony import */ var micromatch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(micromatch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6590);
/* harmony import */ var _utils_merge_queue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5323);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7242);
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







class FilterPaths extends _types_generated__WEBPACK_IMPORTED_MODULE_6__/* .HelperInputs */ .m {
}
const filterPaths = async ({ paths, globs, sha, packages }) => {
    const listPrsResult = sha
        ? await _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.repos.listPullRequestsAssociatedWithCommit({
            commit_sha: sha,
            ..._actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo,
            ..._constants__WEBPACK_IMPORTED_MODULE_5__/* .GITHUB_OPTIONS */ .r0
        })
        : undefined;
    const prNumberFromSha = listPrsResult?.data.find(Boolean)?.number;
    const pull_number = _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.eventName === 'merge_group' ? (0,_utils_merge_queue__WEBPACK_IMPORTED_MODULE_4__/* .getPrNumberFromMergeQueueRef */ .M)() : (prNumberFromSha ?? _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.issue.number);
    const { data } = await _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.pulls.listFiles({
        per_page: 100,
        pull_number,
        ..._actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo
    });
    if (packages && hasRelevantPackageChanged(data, packages)) {
        return true;
    }
    const fileNames = data.map(file => file.filename);
    if (globs) {
        if (paths)
            _actions_core__WEBPACK_IMPORTED_MODULE_0__.info('`paths` and `globs` inputs found, defaulting to use `globs` for filtering');
        return micromatch__WEBPACK_IMPORTED_MODULE_2___default()(fileNames, globs.split('\n')).length > 0;
    }
    else if (paths) {
        const filePaths = paths.split('\n');
        return fileNames.some(changedFile => filePaths.some(filePath => changedFile.startsWith(filePath)));
    }
    else {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.error('Must pass `globs` or `paths` for filtering');
    }
};
const hasRelevantPackageChanged = (files, packages) => {
    const packageJson = files.find(file => file.filename === 'package.json');
    if (!packageJson) {
        return false;
    }
    return packages.split('\n').some(pkg => packageJson.patch?.includes(pkg));
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

//# sourceMappingURL=654.index.js.map