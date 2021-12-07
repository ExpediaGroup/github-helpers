exports.id = 124;
exports.ids = [124,747];
exports.modules = {

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
/* harmony import */ var _add_project_card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9747);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6161);
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




const createProjectCard = ({ pull_number, project_name, project_destination_column_name }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('project name: ', project_name);
    console.log('si entre');
    return _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit.pulls.get */ .K.pulls.get(Object.assign({ pull_number }, _actions_github__WEBPACK_IMPORTED_MODULE_2__.context.repo))
        .then((getResponse) => {
        const pullRequest = getResponse.data;
        if (pullRequest) {
            _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit.projects.listForRepo */ .K.projects.listForRepo(Object.assign({ state: 'open', per_page: 100 }, _actions_github__WEBPACK_IMPORTED_MODULE_2__.context.repo))
                .then(projects => {
                const project = findProjectToModify(projects, project_name);
                console.log('project');
                if (project) {
                    _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit.projects.listColumns */ .K.projects.listColumns({
                        project_id: project.id,
                        per_page: 100
                    })
                        .then(response => {
                        const filteredColumn = filterDestinationColumn(response, project_destination_column_name);
                        if (filteredColumn) {
                            return (0,_add_project_card__WEBPACK_IMPORTED_MODULE_1__.addProjectCard)({
                                column_id: filteredColumn.id,
                                content_id: pullRequest.id,
                                content_type: 'PullRequest'
                            }).then(response => {
                                // move the card to the coulmn's bottom after created
                                _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit.projects.moveCard */ .K.projects.moveCard({
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


/***/ })

};
;
//# sourceMappingURL=124.index.js.map