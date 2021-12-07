exports.id = 263;
exports.ids = [263];
exports.modules = {

/***/ 7263:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "moveProjectCard": () => (/* binding */ moveProjectCard)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6161);
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



const moveProjectCard = ({ pull_number, project_destination_column_name, project_origin_column_name, project_name }) => __awaiter(void 0, void 0, void 0, function* () {
    return _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit.pulls.get */ .K.pulls.get(Object.assign({ pull_number }, _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo))
        .then((getResponse) => {
        const pullRequest = getResponse.data;
        if (pullRequest) {
            _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit.projects.listForRepo */ .K.projects.listForRepo(Object.assign({ state: 'open', per_page: 100 }, _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo))
                .then(projects => {
                const project = findProjectToModify(projects, project_name);
                if (project) {
                    _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit.projects.listColumns */ .K.projects.listColumns({
                        project_id: project.id,
                        per_page: 100
                    })
                        .then(response => {
                        const destinationColumn = filterDestinationColumn(response, project_destination_column_name);
                        const filteredColumn = getOriginColumn(response, project_origin_column_name);
                        if (filteredColumn) {
                            _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit.projects.listCards */ .K.projects.listCards({
                                column_id: filteredColumn.id
                            })
                                .then(cards => {
                                const cardToMove = getCardToMove(cards, pullRequest.issue_url);
                                if (cardToMove && destinationColumn) {
                                    _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit.projects.moveCard */ .K.projects.moveCard({
                                        card_id: cardToMove.id,
                                        column_id: destinationColumn.id,
                                        position: 'top'
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    })
        .catch(error => {
        if (error.status === 409) {
            _actions_core__WEBPACK_IMPORTED_MODULE_0__.info('There was an error moving the project card.');
        }
    });
});
const findProjectToModify = (projectsResponse, project_name) => projectsResponse.data.find(project => project.name === project_name);
const filterDestinationColumn = (columns, project_destination_column_name) => columns.data.find(column => column.name === project_destination_column_name);
const getOriginColumn = (columns, project_origin_column_name) => columns.data.find(column => column.name === project_origin_column_name);
const getCardToMove = (cardsResponse, issueUrl) => cardsResponse.data.find(card => card.content_url === issueUrl);


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
//# sourceMappingURL=263.index.js.map