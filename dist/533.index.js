"use strict";
exports.id = 533;
exports.ids = [533];
exports.modules = {

/***/ 2533:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GeneratePathMatrix": () => (/* binding */ GeneratePathMatrix),
/* harmony export */   "generatePathMatrix": () => (/* binding */ generatePathMatrix)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3476);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(250);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_get_changed_filepaths__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9180);
/* harmony import */ var micromatch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6228);
/* harmony import */ var micromatch__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(micromatch__WEBPACK_IMPORTED_MODULE_4__);
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






class GeneratePathMatrix extends _types_generated__WEBPACK_IMPORTED_MODULE_5__/* .HelperInputs */ .s {
}
const generatePathMatrix = ({ paths, globs, 
/** paths that override the changed files filter, causing the action to return all paths */
override_filter_paths, override_filter_globs, 
/** paths that will be returned regardless of their adherence to the filter */
paths_no_filter, 
/** number of evenly-sized batches to separate matching paths into (returns comma-separated result) */
batches }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const pathsToUse = paths || globs;
    if (!pathsToUse) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.error('Must supply one of paths, globs');
        throw new Error();
    }
    const changedFiles = yield (0,_utils_get_changed_filepaths__WEBPACK_IMPORTED_MODULE_3__/* .getChangedFilepaths */ .s)(_actions_github__WEBPACK_IMPORTED_MODULE_2__.context.issue.number);
    const shouldOverrideFilter = override_filter_globs
        ? micromatch__WEBPACK_IMPORTED_MODULE_4___default()(changedFiles, override_filter_globs.split('\n')).length > 0
        : changedFiles.some(changedFile => override_filter_paths === null || override_filter_paths === void 0 ? void 0 : override_filter_paths.split(/[\n,]/).includes(changedFile));
    const splitPaths = pathsToUse.split(/[\n,]/);
    const basePaths = shouldOverrideFilter
        ? splitPaths
        : paths
            ? splitPaths.filter(path => changedFiles.some(changedFile => changedFile.startsWith(path)))
            : splitPaths.filter(glob => micromatch__WEBPACK_IMPORTED_MODULE_4___default()(changedFiles, glob).length > 0);
    const extraPaths = (_a = paths_no_filter === null || paths_no_filter === void 0 ? void 0 : paths_no_filter.split(/[\n,]/)) !== null && _a !== void 0 ? _a : [];
    const matrixValues = (0,lodash__WEBPACK_IMPORTED_MODULE_1__.uniq)(basePaths.concat(extraPaths));
    if (batches) {
        return {
            include: (0,lodash__WEBPACK_IMPORTED_MODULE_1__.chunk)(matrixValues, Math.ceil(matrixValues.length / Number(batches))).map(chunk => ({ path: chunk.join(',') }))
        };
    }
    return {
        include: matrixValues.map(path => ({ path }))
    };
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
const { rest: octokit, graphql: octokitGraphql } = (0,_actions_github__WEBPACK_IMPORTED_MODULE_2__.getOctokit)(githubToken, {
    request: { fetch: _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__ },
    log: { debug: _actions_core__WEBPACK_IMPORTED_MODULE_0__.debug, info: _actions_core__WEBPACK_IMPORTED_MODULE_0__.info, warn: _actions_core__WEBPACK_IMPORTED_MODULE_0__.warning, error: _actions_core__WEBPACK_IMPORTED_MODULE_0__.error }
});


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

/***/ 9180:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "s": () => (/* binding */ getChangedFilepaths)
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


const getChangedFilepaths = (pull_number) => __awaiter(void 0, void 0, void 0, function* () {
    const changedFiles = yield paginateAllChangedFilepaths(pull_number);
    return changedFiles.map(file => file.filename);
});
const paginateAllChangedFilepaths = (pull_number, page = 1) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit.pulls.listFiles */ .K.pulls.listFiles(Object.assign({ pull_number, per_page: 100, page }, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo));
    if (!response.data.length) {
        return [];
    }
    return response.data.concat(yield paginateAllChangedFilepaths(pull_number, page + 1));
});


/***/ })

};
;
//# sourceMappingURL=533.index.js.map