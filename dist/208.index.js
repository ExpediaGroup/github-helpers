export const id = 208;
export const ids = [208];
export const modules = {

/***/ 208:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GeneratePathMatrix: () => (/* binding */ GeneratePathMatrix),
/* harmony export */   generatePathMatrix: () => (/* binding */ generatePathMatrix)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4116);
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8428);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2356);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6474);
/* harmony import */ var _utils_get_changed_filepaths__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6039);
/* harmony import */ var micromatch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8785);
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






class GeneratePathMatrix extends _types_generated__WEBPACK_IMPORTED_MODULE_5__/* .HelperInputs */ .m {
}
const generatePathMatrix = async ({ paths, globs, 
/** paths that override the changed files filter, causing the action to return all paths */
override_filter_paths, override_filter_globs, 
/** paths that will be returned regardless of their adherence to the filter */
paths_no_filter, 
/** number of evenly-sized batches to separate matching paths into (returns comma-separated result) */
batches }) => {
    const pathsToUse = paths || globs;
    if (!pathsToUse) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .error */ .z3('Must supply one of paths, globs');
        throw new Error();
    }
    const changedFiles = await (0,_utils_get_changed_filepaths__WEBPACK_IMPORTED_MODULE_3__/* .getChangedFilepaths */ .t)(_actions_github__WEBPACK_IMPORTED_MODULE_2__/* .context */ ._.issue.number);
    const shouldOverrideFilter = override_filter_globs
        ? micromatch__WEBPACK_IMPORTED_MODULE_4___default()(changedFiles, override_filter_globs.split('\n')).length > 0
        : changedFiles.some(changedFile => override_filter_paths?.split(/[\n,]/).includes(changedFile));
    const splitPaths = pathsToUse.split(/[\n,]/);
    const basePaths = shouldOverrideFilter
        ? splitPaths
        : paths
            ? splitPaths.filter(path => changedFiles.some(changedFile => changedFile.startsWith(path)))
            : splitPaths.filter(glob => micromatch__WEBPACK_IMPORTED_MODULE_4___default()(changedFiles, glob).length > 0);
    const extraPaths = paths_no_filter?.split(/[\n,]/) ?? [];
    const matrixValues = (0,lodash__WEBPACK_IMPORTED_MODULE_1__.uniq)(basePaths.concat(extraPaths));
    if (batches) {
        return {
            include: (0,lodash__WEBPACK_IMPORTED_MODULE_1__.chunk)(matrixValues, Math.ceil(matrixValues.length / Number(batches))).map(chunk => ({ path: chunk.join(',') }))
        };
    }
    return {
        include: matrixValues.map(path => ({ path }))
    };
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


/***/ }),

/***/ 6039:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   t: () => (/* binding */ getChangedFilepaths)
/* harmony export */ });
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6474);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1015);
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


const getChangedFilepaths = async (pull_number, ignore_deleted) => {
    const changedFiles = await paginateAllChangedFilepaths(pull_number);
    const renamedPreviousFilenames = changedFiles
        .filter(({ status }) => status === 'renamed')
        .map(({ previous_filename }) => previous_filename)
        .filter(Boolean); // GitHub should always include previous_filename for renamed files, but just in case
    const processedFilenames = (ignore_deleted ? changedFiles.filter(({ status }) => status !== 'removed') : changedFiles).map(({ filename }) => filename);
    return processedFilenames.concat(renamedPreviousFilenames);
};
const paginateAllChangedFilepaths = async (pull_number, page = 1) => {
    const response = await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.pulls.listFiles({
        pull_number,
        per_page: 100,
        page,
        ..._actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo
    });
    if (!response.data.length) {
        return [];
    }
    return response.data.concat(await paginateAllChangedFilepaths(pull_number, page + 1));
};


/***/ })

};

//# sourceMappingURL=208.index.js.map