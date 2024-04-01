"use strict";
exports.id = 766;
exports.ids = [766];
exports.modules = {

/***/ 6766:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "rerunPrChecks": () => (/* binding */ rerunPrChecks)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8710);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6161);
/* harmony import */ var _octokit_request__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6234);
/* harmony import */ var _octokit_request__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_octokit_request__WEBPACK_IMPORTED_MODULE_4__);
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
    const { data: { head: { user: { login: owner }, sha: latestHash, ref: branch } } } = await _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit.pulls.get */ .K.pulls.get({
        pull_number: _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.issue.number,
        ..._actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo
    });
    const workflowRunResponses = await (0,bluebird__WEBPACK_IMPORTED_MODULE_2__.map)(['pull_request', 'pull_request_target'], event => _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit.actions.listWorkflowRunsForRepo */ .K.actions.listWorkflowRunsForRepo({
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
    return (0,bluebird__WEBPACK_IMPORTED_MODULE_2__.map)(latestWorkflowRuns, async ({ id, name, rerun_url }) => {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`- Rerunning ${name} (${id})`);
        await (0,_octokit_request__WEBPACK_IMPORTED_MODULE_4__.request)(`POST ${rerun_url}`, {
            headers: {
                authorization: `token ${_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('github_token')}`
            }
        }).catch(error => {
            _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed(error.message);
        });
    });
};


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


/***/ })

};
;
//# sourceMappingURL=766.index.js.map