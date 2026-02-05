export const id = 598;
export const ids = [598];
export const modules = {

/***/ 5598:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RemoveLabel: () => (/* binding */ RemoveLabel),
/* harmony export */   removeLabel: () => (/* binding */ removeLabel),
/* harmony export */   removeLabelIfExists: () => (/* binding */ removeLabelIfExists)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4116);
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6474);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1015);
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




class RemoveLabel extends _types_generated__WEBPACK_IMPORTED_MODULE_3__/* .HelperInputs */ .m {
    label = '';
}
const removeLabel = async ({ label }) => removeLabelIfExists(label, _actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.issue.number);
const removeLabelIfExists = async (labelName, issue_number) => {
    try {
        await _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit */ .A.issues.removeLabel({
            name: labelName,
            issue_number,
            ..._actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo
        });
    }
    catch (error) {
        if (error.status === 404) {
            _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .info */ .pq('Label is not present on PR.');
        }
    }
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

//# sourceMappingURL=598.index.js.map