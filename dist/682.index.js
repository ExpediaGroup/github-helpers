export const id = 682;
export const ids = [682];
export const modules = {

/***/ 1682:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   rerunPrChecks: () => (/* binding */ rerunPrChecks)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4116);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4387);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4366);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3396);
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
        pull_number: _actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.issue.number,
        ..._actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo
    });
    const workflowRunResponses = await (0,bluebird__WEBPACK_IMPORTED_MODULE_2__.map)(['pull_request', 'pull_request_target'], event => _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.actions.listWorkflowRunsForRepo({
        branch,
        ..._actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo,
        owner,
        event,
        per_page: 100,
        status: 'completed'
    }));
    const workflowRuns = workflowRunResponses.map(response => response.data.workflow_runs).flat();
    if (!workflowRuns.length) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .info */ .pq(`No workflow runs found on branch ${branch} on ${owner}/${_actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo.repo}`);
        return;
    }
    const latestWorkflowRuns = workflowRuns.filter(({ head_sha }) => head_sha === latestHash);
    _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .info */ .pq(`There are ${latestWorkflowRuns.length} checks associated with the latest commit, triggering reruns...`);
    return (0,bluebird__WEBPACK_IMPORTED_MODULE_2__.map)(latestWorkflowRuns, async ({ id, name }) => {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .info */ .pq(`- Rerunning ${name} (${id})`);
        await _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.actions.reRunWorkflow({ run_id: id, ..._actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo });
    });
};


/***/ }),

/***/ 3396:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ octokit),
  n: () => (/* binding */ octokitGraphql)
});

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js + 15 modules
var core = __webpack_require__(4116);
// EXTERNAL MODULE: ./node_modules/@octokit/core/dist-src/index.js + 10 modules
var dist_src = __webpack_require__(708);
// EXTERNAL MODULE: ./node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/index.js + 3 modules
var plugin_rest_endpoint_methods_dist_src = __webpack_require__(9210);
// EXTERNAL MODULE: ./node_modules/@octokit/plugin-retry/dist-bundle/index.js
var dist_bundle = __webpack_require__(9735);
;// CONCATENATED MODULE: ./src/logging.ts
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

function logging(octokit) {
    octokit.hook.before('request', async (options) => {
        const endpoint = `${options.method} ${options.url}`;
        core/* info */.pq(`GitHub API call: ${endpoint}`);
    });
    octokit.hook.error('request', async (error, options) => {
        const endpoint = `${options.method} ${options.url}`;
        core/* error */.z3(`GitHub API Error: ${endpoint}`);
        core/* error */.z3(`Message: ${error.message}`);
        if ('status' in error && error.status) {
            core/* error */.z3(`Status: ${error.status}`);
        }
        if ('response' in error && error.response?.data) {
            core/* error */.z3(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        throw error;
    });
}

;// CONCATENATED MODULE: ./src/octokit.ts
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





const githubToken = core/* getInput */.V4('github_token', { required: true });
const baseUrl = process.env.GITHUB_API_URL || 'https://api.github.com';
const OctokitWithPlugins = dist_src/* Octokit */.E.plugin(plugin_rest_endpoint_methods_dist_src/* restEndpointMethods */._, dist_bundle/* retry */.L, logging);
const { rest: octokit, graphql: octokitGraphql } = new OctokitWithPlugins({ auth: githubToken, baseUrl });


/***/ })

};

//# sourceMappingURL=682.index.js.map