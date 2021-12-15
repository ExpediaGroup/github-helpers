exports.id = 533;
exports.ids = [533];
exports.modules = {

/***/ 2533:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "generatePathMatrix": () => (/* binding */ generatePathMatrix)
/* harmony export */ });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(250);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_get_changed_filepaths__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9180);
/* harmony import */ var micromatch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6228);
/* harmony import */ var micromatch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(micromatch__WEBPACK_IMPORTED_MODULE_2__);
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



const generatePathMatrix = ({ pull_number, paths, override_filter_paths, override_filter_globs, paths_no_filter, batches }) => __awaiter(void 0, void 0, void 0, function* () {
    const changedFiles = yield (0,_utils_get_changed_filepaths__WEBPACK_IMPORTED_MODULE_1__/* .getChangedFilepaths */ .s)(pull_number);
    if (override_filter_globs) {
        const globsToFilter = override_filter_globs.split('\n');
        const matches = changedFiles.filter(file => micromatch__WEBPACK_IMPORTED_MODULE_2___default().contains(file, globsToFilter));
        return {
            include: matches.map(path => ({ path }))
        };
    }
    const shouldOverrideFilter = changedFiles.some(changedFile => override_filter_paths === null || override_filter_paths === void 0 ? void 0 : override_filter_paths.split(/[\n,]/).includes(changedFile));
    const splitPaths = paths.split(/[\n,]/);
    const matrixValues = shouldOverrideFilter
        ? splitPaths
        : splitPaths.filter(path => changedFiles.some(changedFile => changedFile.startsWith(path)));
    if (paths_no_filter) {
        const extraPaths = paths_no_filter.split(/[\n,]/);
        extraPaths.forEach(p => {
            if (!matrixValues.includes(p))
                matrixValues.push(p);
        });
    }
    if (batches) {
        return {
            include: (0,lodash__WEBPACK_IMPORTED_MODULE_0__.chunk)(matrixValues, Math.ceil(matrixValues.length / Number(batches))).map(chunk => ({ path: chunk.join(',') }))
        };
    }
    return {
        include: matrixValues.map(path => ({ path }))
    };
});


/***/ }),

/***/ 6161:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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


/***/ }),

/***/ 9180:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "s": () => (/* binding */ getChangedFilepaths)
/* harmony export */ });
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6161);


const getChangedFilepaths = (pull_number) => _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit.pulls.listFiles */ .K.pulls.listFiles(Object.assign({ pull_number: Number(pull_number), per_page: 100 }, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo))
    .then(listFilesResponse => listFilesResponse.data.map(file => file.filename));


/***/ })

};
;
//# sourceMappingURL=533.index.js.map