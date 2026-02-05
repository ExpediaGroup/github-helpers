export const id = 400;
export const ids = [400];
export const modules = {

/***/ 6400:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DeleteDeployment: () => (/* binding */ DeleteDeployment),
/* harmony export */   deleteDeployment: () => (/* binding */ deleteDeployment)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4116);
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6474);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1015);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4366);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_3__);
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





const DEFAULT_MAP_CONCURRENCY = 5;
class DeleteDeploymentResponse {
    deploymentsDeleted = 0;
    deploymentsFound = 0;
    message = '';
    environmentDeleted = false;
    constructor(init) {
        Object.assign(this, init);
    }
}
class DeleteDeployment extends _types_generated__WEBPACK_IMPORTED_MODULE_4__/* .HelperInputs */ .m {
    environment = '';
}
const deactivateDeployments = async (deployments) => {
    const statusResponse = await (0,bluebird__WEBPACK_IMPORTED_MODULE_3__.map)(deployments, async (deploymentId) => {
        return _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit */ .A.repos.createDeploymentStatus({
            state: 'inactive',
            deployment_id: deploymentId,
            ..._actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo
        });
    }, { concurrency: DEFAULT_MAP_CONCURRENCY });
    const deletionMatch = statusResponse.filter(result => result.data.state === 'success').length === deployments.length;
    if (!deletionMatch) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .info */ .pq(`Not all deployments were successfully deactivated. Some may still be active.`);
    }
};
const deleteDeployments = async (deployments) => {
    return await (0,bluebird__WEBPACK_IMPORTED_MODULE_3__.map)(deployments, async (deploymentId) => {
        return _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit */ .A.repos.deleteDeployment({
            deployment_id: deploymentId,
            ..._actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo
        });
    }, { concurrency: DEFAULT_MAP_CONCURRENCY });
};
const deleteDeployment = async ({ sha, environment }) => {
    const { data } = await _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit */ .A.repos.listDeployments({
        sha,
        environment,
        ..._actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo
    });
    if (!data.length) {
        return new DeleteDeploymentResponse({
            message: `No deployments found for environment ${environment}`
        });
    }
    const deployments = data.map(deployment => deployment.id);
    await deactivateDeployments(deployments);
    const reqResults = await deleteDeployments(deployments);
    const envDelResult = await _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit */ .A.repos
        .deleteAnEnvironment({
        environment_name: environment,
        ..._actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo
    })
        .catch(() => null);
    const deploymentsDeleted = reqResults.filter(result => result.status === 204).length;
    const environmentDeleted = envDelResult?.status === 204;
    return new DeleteDeploymentResponse({
        deploymentsDeleted,
        deploymentsFound: data.length,
        environmentDeleted,
        message: `Deleted ${deploymentsDeleted} deployments for environment ${environment}`
    });
};


/***/ }),

/***/ 1015:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ octokit),
  n: () => (/* binding */ octokitGraphql)
});

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js + 15 modules
var core = __webpack_require__(4116);
// EXTERNAL MODULE: ./node_modules/@adobe/node-fetch-retry/index.js
var node_fetch_retry = __webpack_require__(1806);
// EXTERNAL MODULE: ./node_modules/@actions/github/lib/github.js + 20 modules
var github = __webpack_require__(6474);
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
const { rest: octokit, graphql: octokitGraphql } = (0,github/* getOctokit */.Q)(githubToken, {
    request: { fetch: node_fetch_retry },
    plugins: [logging]
});


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


/***/ })

};

//# sourceMappingURL=400.index.js.map