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
/* harmony import */ var _utils_get_project_columns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3041);
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




const moveProjectCard = ({ project_destination_column_name, project_origin_column_name, project_name }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const columnsList = yield (0,_utils_get_project_columns__WEBPACK_IMPORTED_MODULE_1__/* .getProjectColumns */ .N)({ project_name });
    if (!((_a = columnsList === null || columnsList === void 0 ? void 0 : columnsList.data) === null || _a === void 0 ? void 0 : _a.length)) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.error(`There are no columns associated to ${project_name} project.`);
        return;
    }
    const destinationColumn = (0,_utils_get_project_columns__WEBPACK_IMPORTED_MODULE_1__/* .getDestinationColumn */ .Y)(columnsList, project_destination_column_name);
    const originColumn = getOriginColumn(columnsList, project_origin_column_name);
    if (!originColumn) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`No origin column was found for the name ${project_origin_column_name}`);
        return;
    }
    const cardToMove = yield getCardToMove(originColumn);
    if (cardToMove && destinationColumn) {
        return _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit.projects.moveCard */ .K.projects.moveCard({
            card_id: cardToMove.id,
            column_id: destinationColumn.id,
            position: 'top',
            headers: {
                accept: 'application/vnd.github.v3+json'
            }
        });
    }
    else {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info('No destination column or card to move was found');
        return;
    }
});
const getCardToMove = (originColumn) => __awaiter(void 0, void 0, void 0, function* () {
    const getResponse = yield _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit.pulls.get */ .K.pulls.get(Object.assign({ pull_number: _actions_github__WEBPACK_IMPORTED_MODULE_2__.context.issue.number }, _actions_github__WEBPACK_IMPORTED_MODULE_2__.context.repo));
    const pullRequest = getResponse.data;
    const cardsResponse = yield _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit.projects.listCards */ .K.projects.listCards({
        column_id: originColumn.id,
        headers: {
            accept: 'application/vnd.github.v3+json'
        }
    });
    return cardsResponse.data.find(card => card.content_url === pullRequest.issue_url);
});
const getOriginColumn = (columns, project_origin_column_name) => columns.data.find(column => column.name === project_origin_column_name);


/***/ }),

/***/ 6161:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "K": () => (/* binding */ octokit),
/* harmony export */   "k": () => (/* binding */ octokitWithPat)
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


const githubToken = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('github_token', { required: true });
const octokit = (0,_actions_github__WEBPACK_IMPORTED_MODULE_1__.getOctokit)(githubToken).rest;
const octokitWithPat = (0,_actions_github__WEBPACK_IMPORTED_MODULE_1__.getOctokit)(_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('personal_access_token') || githubToken).rest;


/***/ }),

/***/ 3041:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "N": () => (/* binding */ getProjectColumns),
/* harmony export */   "Y": () => (/* binding */ getDestinationColumn)
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


const getProjectColumns = ({ project_name }) => __awaiter(void 0, void 0, void 0, function* () {
    const projectList = yield _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit.projects.listForRepo */ .K.projects.listForRepo(Object.assign(Object.assign({ state: 'open', per_page: 100 }, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo), { headers: {
            accept: 'application/vnd.github.v3+json'
        } }));
    const project = findProjectToModify(projectList, project_name);
    if (!project) {
        return null;
    }
    return _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit.projects.listColumns */ .K.projects.listColumns({
        project_id: project.id,
        per_page: 100,
        headers: {
            accept: 'application/vnd.github.v3+json'
        }
    });
});
const findProjectToModify = (projectsResponse, project_name) => projectsResponse.data.find(project => project.name === project_name);
const getDestinationColumn = (columns, project_destination_column_name) => columns.data.find(column => column.name === project_destination_column_name);


/***/ })

};
;
//# sourceMappingURL=263.index.js.map