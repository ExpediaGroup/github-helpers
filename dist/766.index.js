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



const rerunPrChecks = () => __awaiter(void 0, void 0, void 0, function* () {
    /** grab owner in case of fork branch */
    const { data: { head: { user: { login: owner }, sha: latestHash, ref: branch } } } = yield _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit.pulls.get */ .K.pulls.get(Object.assign({ pull_number: _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.issue.number }, _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo));
    const workflowRuns = yield _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit.actions.listWorkflowRunsForRepo */ .K.actions.listWorkflowRunsForRepo(Object.assign(Object.assign({ branch }, _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo), { owner, event: 'pull_request', per_page: 100 }));
    if (!workflowRuns.data.workflow_runs.length) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`No workflow runs found on branch ${branch} on ${owner}/${_actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo.repo}`);
        return;
    }
    /** grab only latest occurrence of each workflow run */
    const latestRuns = workflowRuns.data.workflow_runs.filter(({ head_sha }) => head_sha === latestHash);
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Found the ${latestRuns} latest runs on this branch, triggering reruns...`);
    /** trigger a rerun for all of the latest runs on the branch */
    latestRuns.forEach(({ id, name }) => __awaiter(void 0, void 0, void 0, function* () {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`- Rerunning ${name}`);
        yield _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit.request */ .K.request('POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun', {
            owner,
            repo: _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo.repo,
            run_id: id
        });
    }));
});


/***/ }),

/***/ 6161:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "K": () => (/* binding */ octokit)
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
const octokit = (0,_actions_github__WEBPACK_IMPORTED_MODULE_2__.getOctokit)(githubToken, { request: { fetch: _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__ } }).rest;


/***/ })

};
;
//# sourceMappingURL=766.index.js.map