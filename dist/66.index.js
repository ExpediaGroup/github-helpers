"use strict";
exports.id = 66;
exports.ids = [66];
exports.modules = {

/***/ 1066:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "CreatePR": () => (/* binding */ CreatePR),
  "createPr": () => (/* binding */ createPr)
});

// EXTERNAL MODULE: ./src/types/generated.ts
var generated = __webpack_require__(3476);
// EXTERNAL MODULE: ./node_modules/@actions/github/lib/github.js
var github = __webpack_require__(5438);
// EXTERNAL MODULE: ./src/octokit.ts
var octokit = __webpack_require__(6161);
;// CONCATENATED MODULE: ./src/utils/get-default-branch.ts
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


const getDefaultBranch = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data: { default_branch } } = yield octokit/* octokit.repos.get */.K.repos.get(Object.assign({}, github.context.repo));
    return default_branch;
});

;// CONCATENATED MODULE: ./src/helpers/create-pr.ts
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
var create_pr_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




class CreatePR extends generated/* HelperInputs */.s {
    constructor() {
        super(...arguments);
        this.title = '';
        this.body = '';
    }
}
const createPr = ({ title, body, head = github.context.ref.replace('refs/heads/', ''), base, repo = github.context.repo.repo, owner = github.context.repo.owner }) => create_pr_awaiter(void 0, void 0, void 0, function* () {
    const pr_base = base || (yield getDefaultBranch());
    yield updateHeadWithBaseBranch(pr_base, head);
    const { data: { number } } = yield octokit/* octokit.pulls.create */.K.pulls.create({
        title,
        head,
        base: pr_base,
        body,
        maintainer_can_modify: true,
        repo,
        owner
    });
    return number;
});
const updateHeadWithBaseBranch = (base, head) => octokit/* octokit.repos.merge */.K.repos.merge(Object.assign({ base: head, head: base }, github.context.repo));


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


/***/ }),

/***/ 3476:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "s": () => (/* binding */ HelperInputs)
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
;
//# sourceMappingURL=66.index.js.map