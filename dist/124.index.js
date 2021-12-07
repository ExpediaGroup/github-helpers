exports.id = 124;
exports.ids = [124,747];
exports.modules = {

/***/ 9042:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Cc": () => (/* binding */ GITHUB_OPTIONS),
/* harmony export */   "$9": () => (/* binding */ DEFAULT_PIPELINE_STATUS),
/* harmony export */   "Km": () => (/* binding */ DEFAULT_PIPELINE_DESCRIPTION),
/* harmony export */   "Hc": () => (/* binding */ PRODUCTION_ENVIRONMENT),
/* harmony export */   "mj": () => (/* binding */ DEFAULT_BRANCH),
/* harmony export */   "_d": () => (/* binding */ CORE_APPROVED_PR_LABEL),
/* harmony export */   "Xt": () => (/* binding */ PEER_APPROVED_PR_LABEL),
/* harmony export */   "Ak": () => (/* binding */ READY_FOR_MERGE_PR_LABEL),
/* harmony export */   "IH": () => (/* binding */ FIRST_QUEUED_PR_LABEL),
/* harmony export */   "nJ": () => (/* binding */ JUMP_THE_QUEUE_PR_LABEL),
/* harmony export */   "ak": () => (/* binding */ QUEUED_FOR_REVIEW),
/* harmony export */   "HW": () => (/* binding */ DEFAULT_PR_TITLE_REGEX),
/* harmony export */   "ju": () => (/* binding */ WAITING_FOR_PEER_APPROVAL),
/* harmony export */   "vt": () => (/* binding */ IN_REVIEW_COLUMN),
/* harmony export */   "wM": () => (/* binding */ READY_FOR_REVIEW_COLUMN),
/* harmony export */   "ne": () => (/* binding */ CORE_REVIEW_APPROVED_COLUMN),
/* harmony export */   "Te": () => (/* binding */ ProjectNamesByRepo)
/* harmony export */ });
/* unused harmony export DEFAULT_EXEMPT_DESCRIPTION */
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
// These extra headers are for experimental operations. Newer versions of octokit may not require this
const GITHUB_OPTIONS = {
    headers: {
        accept: 'application/vnd.github.ant-man-preview+json,application/vnd.github.flash-preview+json'
    }
};
const DEFAULT_EXEMPT_DESCRIPTION = 'Passed in case the check is exempt.';
const DEFAULT_PIPELINE_STATUS = 'Pipeline Status';
const DEFAULT_PIPELINE_DESCRIPTION = 'Pipeline clear.';
const PRODUCTION_ENVIRONMENT = 'production';
const DEFAULT_BRANCH = 'main';
const CORE_APPROVED_PR_LABEL = 'CORE APPROVED';
const PEER_APPROVED_PR_LABEL = 'PEER APPROVED';
const READY_FOR_MERGE_PR_LABEL = 'READY FOR MERGE';
const FIRST_QUEUED_PR_LABEL = 'QUEUED FOR MERGE #1';
const JUMP_THE_QUEUE_PR_LABEL = 'JUMP THE QUEUE';
const QUEUED_FOR_REVIEW = 'QUEUED FOR REVIEW :pencil2:';
const DEFAULT_PR_TITLE_REGEX = '^(build|ci|chore|docs|feat|fix|perf|refactor|style|test|revert|Revert)((.*))?: .+$';
// GitHub Projects
const WAITING_FOR_PEER_APPROVAL = 'Waiting for Peer Approval';
const IN_REVIEW_COLUMN = 'Core Review In Progress';
const READY_FOR_REVIEW_COLUMN = 'Ready for Core Review QUEUE';
const CORE_REVIEW_APPROVED_COLUMN = 'Core Review Approved';
const ProjectNamesByRepo = [
    {
        'blossom-flex-ui': 'Blossom-PR-Review-Project'
    }
];


/***/ }),

/***/ 9747:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addProjectCard": () => (/* binding */ addProjectCard)
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


const addProjectCard = ({ column_id, note, content_id, content_type }) => _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit.projects.createCard */ .K.projects.createCard(Object.assign({ column_id,
    note,
    content_id,
    content_type }, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo));


/***/ }),

/***/ 6124:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createProjectCard": () => (/* binding */ createProjectCard)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9042);
/* harmony import */ var _add_project_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9747);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils_get_project_name__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3231);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6161);
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






const createProjectCard = ({ pull_number }) => __awaiter(void 0, void 0, void 0, function* () {
    const repositoryName = _actions_github__WEBPACK_IMPORTED_MODULE_3__.context.repo.repo;
    const projectName = (0,_utils_get_project_name__WEBPACK_IMPORTED_MODULE_4__/* .getProjectName */ .s)({ repo: repositoryName });
    console.log('si entre');
    const destinationColumn = _constants__WEBPACK_IMPORTED_MODULE_1__/* .WAITING_FOR_PEER_APPROVAL */ .ju;
    return _octokit__WEBPACK_IMPORTED_MODULE_5__/* .octokit.pulls.get */ .K.pulls.get(Object.assign({ pull_number }, _actions_github__WEBPACK_IMPORTED_MODULE_3__.context.repo))
        .then((getResponse) => {
        const pullRequest = getResponse.data;
        if (pullRequest) {
            _octokit__WEBPACK_IMPORTED_MODULE_5__/* .octokit.projects.listForRepo */ .K.projects.listForRepo(Object.assign({ state: 'open', per_page: 100 }, _actions_github__WEBPACK_IMPORTED_MODULE_3__.context.repo))
                .then(projects => {
                const project = findProjectToModify(projects, projectName);
                console.log('project');
                if (project) {
                    _octokit__WEBPACK_IMPORTED_MODULE_5__/* .octokit.projects.listColumns */ .K.projects.listColumns({
                        project_id: project.id,
                        per_page: 100
                    })
                        .then(response => {
                        const filteredColumn = filterDestinationColumn(response, destinationColumn);
                        if (filteredColumn) {
                            return (0,_add_project_card__WEBPACK_IMPORTED_MODULE_2__.addProjectCard)({
                                column_id: filteredColumn.id,
                                content_id: pullRequest.id,
                                content_type: 'PullRequest'
                            }).then(response => {
                                // move the card to the coulmn's bottom after created
                                _octokit__WEBPACK_IMPORTED_MODULE_5__/* .octokit.projects.moveCard */ .K.projects.moveCard({
                                    card_id: response.data.id,
                                    position: 'bottom',
                                    column_id: filteredColumn.id
                                });
                                // .then(() => {
                                //   return addLabels({
                                //     labels: QUEUED_FOR_REVIEW,
                                //     pull_number: String(pullRequest.number)
                                //   });
                                // });
                            });
                        }
                    });
                }
            });
        }
    })
        .catch(error => {
        if (error.status === 409) {
            _actions_core__WEBPACK_IMPORTED_MODULE_0__.info('There was an error creating the project card.');
        }
    });
});
const findProjectToModify = (projectsResponse, projectName) => projectsResponse.data.find(project => project.name === projectName);
const filterDestinationColumn = (columns, destinationColumn) => columns.data.find(column => column.name === destinationColumn);


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

/***/ 3231:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "s": () => (/* binding */ getProjectName)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9042);
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

const getProjectName = ({ repo }) => {
    const repos = _constants__WEBPACK_IMPORTED_MODULE_0__/* .ProjectNamesByRepo.find */ .Te.find((item) => item[repo]);
    const [projectName] = Object.values(repos || {});
    return projectName;
};


/***/ })

};
;
//# sourceMappingURL=124.index.js.map