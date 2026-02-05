export const id = 862;
export const ids = [862];
export const modules = {

/***/ 4862:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetEmailOnUserProfile: () => (/* binding */ GetEmailOnUserProfile),
/* harmony export */   getEmailOnUserProfile: () => (/* binding */ getEmailOnUserProfile)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8428);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6590);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4116);
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



class GetEmailOnUserProfile extends _types_generated__WEBPACK_IMPORTED_MODULE_2__/* .HelperInputs */ .m {
    login = '';
}
const getEmailOnUserProfile = async ({ login, pattern }) => {
    const { data: { email } } = await _octokit__WEBPACK_IMPORTED_MODULE_0__/* .octokit */ .A.users.getByUsername({ username: login });
    if (!email) {
        (0,_actions_core__WEBPACK_IMPORTED_MODULE_1__/* .setFailed */ .C1)(`User ${login} does not have an email address on their GitHub profile!`);
        return;
    }
    if (pattern && !new RegExp(pattern).test(email)) {
        (0,_actions_core__WEBPACK_IMPORTED_MODULE_1__/* .setFailed */ .C1)(`Email ${email} does not match regex pattern ${pattern}. Please update the email on your GitHub profile to match this pattern!`);
        return;
    }
    return email;
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
        // Log request details for debugging
        _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .debug */ .Yz(`Request options: ${JSON.stringify(options, null, 2)}`);
        throw error;
    });
    octokit.hook.before('request', async (options) => {
        const endpoint = `${options.method} ${options.url}`;
        _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .debug */ .Yz(`GitHub API call: ${endpoint}`);
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


/***/ })

};

//# sourceMappingURL=862.index.js.map