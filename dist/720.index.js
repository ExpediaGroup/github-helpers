export const id = 720;
export const ids = [720,280];
export const modules = {

/***/ 4720:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClosePr: () => (/* binding */ ClosePr),
/* harmony export */   closePr: () => (/* binding */ closePr)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4387);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3396);
/* harmony import */ var _create_pr_comment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9280);
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




class ClosePr extends _types_generated__WEBPACK_IMPORTED_MODULE_3__/* .HelperInputs */ .m {
}
const closePr = async ({ body, pull_number, repo_name, repo_owner_name } = {}) => {
    if ((repo_name || repo_owner_name) && !pull_number) {
        throw new Error('pull_number is required when repo_name or repo_owner_name is provided');
    }
    if (body) {
        await (0,_create_pr_comment__WEBPACK_IMPORTED_MODULE_2__.createPrComment)({ body, pull_number, repo_name, repo_owner_name });
    }
    return _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.pulls.update({
        pull_number: pull_number ? Number(pull_number) : _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.issue.number,
        repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.repo,
        owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.owner,
        state: 'closed'
    });
};


/***/ }),

/***/ 9280:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CreatePrComment: () => (/* binding */ CreatePrComment),
/* harmony export */   createPrComment: () => (/* binding */ createPrComment)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4387);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3396);
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



class CreatePrComment extends _types_generated__WEBPACK_IMPORTED_MODULE_2__/* .HelperInputs */ .m {
    body = '';
}
const emptyResponse = { data: [] };
const getFirstPrByCommit = async (sha, repo_name, repo_owner_name) => {
    const prs = (sha &&
        (await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.repos.listPullRequestsAssociatedWithCommit({
            commit_sha: sha,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.owner
        }))) ||
        emptyResponse;
    return prs.data.find(Boolean)?.number;
};
const getCommentByUser = async (login, pull_number, repo_name, repo_owner_name) => {
    const comments = (login &&
        (await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.issues.listComments({
            issue_number: pull_number ? Number(pull_number) : _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.issue.number,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.owner
        }))) ||
        emptyResponse;
    return comments.data.find(comment => comment?.user?.login === login)?.id;
};
const createPrComment = async ({ body, sha, login, pull_number, repo_name, repo_owner_name }) => {
    const defaultPrNumber = _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.issue.number;
    if (!sha && !login) {
        return _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.issues.createComment({
            body,
            issue_number: pull_number ? Number(pull_number) : defaultPrNumber,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.owner
        });
    }
    const prNumber = (await getFirstPrByCommit(sha, repo_name, repo_owner_name)) ?? (pull_number ? Number(pull_number) : defaultPrNumber);
    const commentId = await getCommentByUser(login, pull_number, repo_name, repo_owner_name);
    if (commentId) {
        return _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.issues.updateComment({
            comment_id: commentId,
            body,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.owner
        });
    }
    else {
        return _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.issues.createComment({
            body,
            issue_number: prNumber,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.owner
        });
    }
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
const OctokitWithPlugins = dist_src/* Octokit */.E.plugin(plugin_rest_endpoint_methods_dist_src/* restEndpointMethods */._, dist_bundle/* retry */.L, logging);
const { rest: octokit, graphql: octokitGraphql } = new OctokitWithPlugins({ auth: githubToken });


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

//# sourceMappingURL=720.index.js.map