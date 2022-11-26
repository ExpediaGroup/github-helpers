"use strict";
exports.id = 180;
exports.ids = [180];
exports.modules = {

/***/ 2180:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CheckMergeSafety": () => (/* binding */ CheckMergeSafety),
/* harmony export */   "checkMergeSafety": () => (/* binding */ checkMergeSafety)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(3476);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6161);
/* harmony import */ var _utils_get_default_branch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(977);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(250);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var micromatch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6228);
/* harmony import */ var micromatch__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(micromatch__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_5__);
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







class CheckMergeSafety extends _types_generated__WEBPACK_IMPORTED_MODULE_6__/* .HelperInputs */ .s {
    constructor() {
        super(...arguments);
        this.base = '';
    }
}
const checkMergeSafety = ({ base, override_filter_paths, override_filter_globs }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const defaultBranch = yield (0,_utils_get_default_branch__WEBPACK_IMPORTED_MODULE_2__/* .getDefaultBranch */ ._)();
    const { data: { files: filesWhichBranchIsBehindOn } } = yield _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit.repos.compareCommitsWithBasehead */ .K.repos.compareCommitsWithBasehead(Object.assign(Object.assign({}, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo), { basehead: `${base}...${defaultBranch}` }));
    const fileNamesWhichBranchIsBehindOn = (_a = filesWhichBranchIsBehindOn === null || filesWhichBranchIsBehindOn === void 0 ? void 0 : filesWhichBranchIsBehindOn.map(file => file.filename)) !== null && _a !== void 0 ? _a : [];
    _actions_core__WEBPACK_IMPORTED_MODULE_5__.info(JSON.stringify(fileNamesWhichBranchIsBehindOn));
    const shouldOverrideSafetyCheck = override_filter_globs
        ? micromatch__WEBPACK_IMPORTED_MODULE_4___default()(fileNamesWhichBranchIsBehindOn, override_filter_globs.split('\n')).length > 0
        : fileNamesWhichBranchIsBehindOn.some(changedFile => override_filter_paths === null || override_filter_paths === void 0 ? void 0 : override_filter_paths.split(/[\n,]/).includes(changedFile));
    if (shouldOverrideSafetyCheck) {
        throw new Error(`Please update ${base} with ${defaultBranch}`);
    }
    const { data: { files: changedFiles } } = yield _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit.repos.compareCommitsWithBasehead */ .K.repos.compareCommitsWithBasehead(Object.assign(Object.assign({}, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo), { basehead: `${defaultBranch}...${base}` }));
    const changedFileNames = changedFiles === null || changedFiles === void 0 ? void 0 : changedFiles.map(file => file.filename);
    _actions_core__WEBPACK_IMPORTED_MODULE_5__.info(JSON.stringify(changedFileNames));
    const changedFilesIntersect = (0,lodash__WEBPACK_IMPORTED_MODULE_3__.intersection)(fileNamesWhichBranchIsBehindOn, changedFileNames).length > 0;
    if (changedFilesIntersect) {
        throw new Error(`Please update ${base} with ${defaultBranch}`);
    }
    _actions_core__WEBPACK_IMPORTED_MODULE_5__.info('This PR is safe to merge!');
});


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


/***/ }),

/***/ 977:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_": () => (/* binding */ getDefaultBranch)
/* harmony export */ });
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6161);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);
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
    const { data: { default_branch } } = yield _octokit__WEBPACK_IMPORTED_MODULE_0__/* .octokit.repos.get */ .K.repos.get(Object.assign({}, _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo));
    return default_branch;
});


/***/ })

};
;
//# sourceMappingURL=180.index.js.map