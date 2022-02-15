"use strict";
exports.id = 313;
exports.ids = [313];
exports.modules = {

/***/ 8313:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RerunPrWorkflows": () => (/* binding */ RerunPrWorkflows),
/* harmony export */   "rerunPrWorkflows": () => (/* binding */ rerunPrWorkflows)
/* harmony export */ });
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6161);
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


class RerunPrWorkflows {
    constructor() {
        this.branch = '';
        //maybe fork name should be an optional input?
        // forkName?: string;
    }
}
const rerunPrWorkflows = ({ branch }) => __awaiter(void 0, void 0, void 0, function* () {
    // list all workflow runs
    const allRuns = yield _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit.request */ .K.request('GET /repos/{owner}/{repo}/actions/{branch}', {
        owner: _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.owner,
        repo: _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.repo,
        branch
    });
    // store the latest run of each workflow
    //double-check the structure of the response.
    const latest = allRuns.data.workflow_runs[0];
    // each workflow run instance has a rerun_url
    // trigger a POST request to the rerun_url to force a rerun
    yield _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit.request */ .K.request('POST /repos/{owner}/{repo}/{branch}/actions/runs/{run_id}/rerun', {
        owner: _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.owner,
        repo: _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.repo,
        run_id: latest.run_id
    });
});


/***/ }),

/***/ 6161:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "K": () => (/* binding */ octokit)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
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


const octokit = (0,_actions_github__WEBPACK_IMPORTED_MODULE_1__.getOctokit)(_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('github_token', { required: true })).rest;


/***/ })

};
;
//# sourceMappingURL=313.index.js.map