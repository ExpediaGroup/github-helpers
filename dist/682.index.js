export const id = 682;
export const ids = [682];
export const modules = {

/***/ 1682:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   rerunPrChecks: () => (/* binding */ rerunPrChecks)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
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




const rerunPrChecks = async () => {
    /** grab owner in case of fork branch */
    const { data: { head: { user: { login: owner }, sha: latestHash, ref: branch } } } = await _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.pulls.get({
        pull_number: _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.issue.number,
        ..._actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo
    });
    const workflowRunResponses = await (0,bluebird__WEBPACK_IMPORTED_MODULE_2__.map)(['pull_request', 'pull_request_target'], event => _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.actions.listWorkflowRunsForRepo({
        branch,
        ..._actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo,
        owner,
        event,
        per_page: 100,
        status: 'completed'
    }));
    const workflowRuns = workflowRunResponses.map(response => response.data.workflow_runs).flat();
    if (!workflowRuns.length) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`No workflow runs found on branch ${branch} on ${owner}/${_actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo.repo}`);
        return;
    }
    const latestWorkflowRuns = workflowRuns.filter(({ head_sha }) => head_sha === latestHash);
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`There are ${latestWorkflowRuns.length} checks associated with the latest commit, triggering reruns...`);
    return (0,bluebird__WEBPACK_IMPORTED_MODULE_2__.map)(latestWorkflowRuns, async ({ id, name }) => {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`- Rerunning ${name} (${id})`);
        await _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.actions.reRunWorkflow({ run_id: id, ..._actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo });
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


/***/ })

};

//# sourceMappingURL=682.index.js.map