export const id = 604;
export const ids = [604];
export const modules = {

/***/ 3604:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetMergeQueuePosition: () => (/* binding */ GetMergeQueuePosition),
/* harmony export */   getMergeQueuePosition: () => (/* binding */ getMergeQueuePosition)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6474);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6590);
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




class GetMergeQueuePosition extends _types_generated__WEBPACK_IMPORTED_MODULE_3__/* .HelperInputs */ .m {
}
const getMergeQueuePosition = async ({ max_queue_size = '10' }) => {
    const { repository } = await (0,_octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokitGraphql */ .n)(`
query {
  repository(owner: "${_actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.owner}", name: "${_actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.repo}") {
    mergeQueue {
      entries(first: ${max_queue_size}) {
        nodes {
          pullRequest {
            number
          }
          position
        }
      }
    }
  }
}
`);
    const prNumberFromMergeQueueRef = (0,_utils_merge_queue__WEBPACK_IMPORTED_MODULE_2__/* .getPrNumberFromMergeQueueRef */ .M)();
    const mergeQueueEntries = repository.mergeQueue?.entries?.nodes;
    return mergeQueueEntries?.find(entry => entry?.pullRequest?.number === prNumberFromMergeQueueRef)?.position;
};


/***/ }),

/***/ 6590:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ octokit),
/* harmony export */   n: () => (/* binding */ octokitGraphql)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4116);
/* harmony import */ var _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1806);
/* harmony import */ var _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6474);
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



const githubToken = _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .getInput */ .V4('github_token', { required: true });
const { rest: octokit, graphql: octokitGraphql } = (0,_actions_github__WEBPACK_IMPORTED_MODULE_2__/* .getOctokit */ .Q)(githubToken, {
    request: { fetch: _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__ },
    plugins: [errorLoggingPlugin]
});
function errorLoggingPlugin(octokit) {
    octokit.hook.error('request', async (error, options) => {
        const endpoint = `${options.method} ${options.url}`;
        _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .error */ .z3(`GitHub API Error: ${endpoint}`);
        _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .error */ .z3(`Message: ${error.message}`);
        if ('status' in error && error.status) {
            _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .error */ .z3(`Status: ${error.status}`);
        }
        if ('response' in error && error.response?.data) {
            _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .error */ .z3(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .debug */ .Yz(`Request options: ${JSON.stringify(options, null, 2)}`);
        throw error;
    });
    octokit.hook.before('request', async (options) => {
        const endpoint = `${options.method} ${options.url}`;
        _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .info */ .pq(`GitHub API call: ${endpoint}`);
    });
}


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
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6474);
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
const getPrNumberFromMergeQueueRef = (ref = _actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.ref) => {
    const prNumber = Number(ref
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
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6474);
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
        ..._actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo
    });
    if (!response.data.length) {
        return [];
    }
    return [...response.data, ...(await paginateAllBranches({ protectedBranches, page: page + 1 }))];
};


/***/ })

};

//# sourceMappingURL=604.index.js.map