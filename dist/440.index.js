export const id = 440;
export const ids = [440];
export const modules = {

/***/ 7440:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CreatePR: () => (/* binding */ CreatePR),
/* harmony export */   createPr: () => (/* binding */ createPr)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6474);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1015);
/* harmony import */ var _utils_get_default_branch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4682);
/* harmony import */ var simple_git__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9070);
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





class CreatePR extends _types_generated__WEBPACK_IMPORTED_MODULE_4__/* .HelperInputs */ .m {
    title = '';
    body = '';
}
const createPr = async ({ title, body, head, base, return_full_payload, branch_name, commit_message }) => {
    const resolvedHead = await getOrCreateHeadBranch({ head, branch_name, commit_message });
    const pr_base = base || (await (0,_utils_get_default_branch__WEBPACK_IMPORTED_MODULE_2__/* .getDefaultBranch */ .Q)());
    await updateHeadWithBaseBranch(pr_base, resolvedHead);
    const { data } = await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.pulls.create({
        title,
        head: resolvedHead,
        base: pr_base,
        body,
        maintainer_can_modify: true,
        ..._actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo
    });
    return return_full_payload === 'true' ? data : data.number;
};
const getOrCreateHeadBranch = async ({ head, branch_name, commit_message }) => {
    if (branch_name && commit_message) {
        const git = (0,simple_git__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Ay)();
        await git.addConfig('user.name', 'github-actions[bot]');
        await git.addConfig('user.email', 'github-actions[bot]@users.noreply.github.com');
        await git.checkoutLocalBranch(branch_name);
        await git.add('.');
        await git.commit(commit_message);
        await git.push('origin', branch_name);
        return branch_name;
    }
    return head || _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.ref.replace('refs/heads/', '');
};
const updateHeadWithBaseBranch = (base, head) => _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.repos.merge({
    base: head,
    head: base,
    ..._actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo
});


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

const logging = (octokit) => {
    core/* info */.pq('Logging plugin initialized');
    octokit.hook.wrap('request', async (request, options) => {
        const endpoint = `${options.method} ${options.url}`;
        core/* info */.pq(`GitHub API call: ${endpoint}`);
        try {
            return await request(options);
        }
        catch (error) {
            core/* error */.z3(`GitHub API Error: ${endpoint}`);
            core/* error */.z3(`Message: ${error.message}`);
            if (error && typeof error === 'object' && 'status' in error) {
                core/* error */.z3(`Status: ${error.status}`);
            }
            if (error && typeof error === 'object' && 'response' in error) {
                const requestError = error;
                if (requestError.response?.data) {
                    core/* error */.z3(`Response: ${JSON.stringify(requestError.response.data, null, 2)}`);
                }
            }
            throw error;
        }
    });
    return {};
};

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


/***/ }),

/***/ 4682:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Q: () => (/* binding */ getDefaultBranch)
/* harmony export */ });
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1015);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6474);
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


const getDefaultBranch = async () => {
    const { data: { default_branch } } = await _octokit__WEBPACK_IMPORTED_MODULE_0__/* .octokit */ .A.repos.get({ ..._actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo });
    return default_branch;
};


/***/ })

};

//# sourceMappingURL=440.index.js.map