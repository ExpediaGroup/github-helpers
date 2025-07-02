export const id = 551;
export const ids = [551];
export const modules = {

/***/ 5551:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MoveProjectCardProps: () => (/* binding */ MoveProjectCardProps),
/* harmony export */   moveProjectCard: () => (/* binding */ moveProjectCard)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_get_project_columns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6315);
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6590);
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





class MoveProjectCardProps extends _types_generated__WEBPACK_IMPORTED_MODULE_4__/* .HelperInputs */ .m {
    project_destination_column_name = '';
    project_name = '';
    project_origin_column_name = '';
}
const moveProjectCard = async ({ project_destination_column_name, project_origin_column_name, project_name }) => {
    const columnsList = await (0,_utils_get_project_columns__WEBPACK_IMPORTED_MODULE_1__/* .getProjectColumns */ .V)({ project_name });
    if (!columnsList?.data?.length) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.error(`There are no columns associated to ${project_name} project.`);
        return;
    }
    const destinationColumn = (0,_utils_get_project_columns__WEBPACK_IMPORTED_MODULE_1__/* .getDestinationColumn */ .x)(columnsList, project_destination_column_name);
    const originColumn = getOriginColumn(columnsList, project_origin_column_name);
    if (!originColumn) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`No origin column was found for the name ${project_origin_column_name}`);
        return;
    }
    const cardToMove = await getCardToMove(originColumn);
    if (cardToMove && destinationColumn) {
        return _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.projects.moveCard({ card_id: cardToMove.id, column_id: destinationColumn.id, position: 'top' });
    }
    else {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info('No destination column or card to move was found');
        return;
    }
};
const getCardToMove = async (originColumn) => {
    const { data: { issue_url } } = await _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.pulls.get({ pull_number: _actions_github__WEBPACK_IMPORTED_MODULE_2__.context.issue.number, ..._actions_github__WEBPACK_IMPORTED_MODULE_2__.context.repo });
    const cardsResponse = await _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.projects.listCards({ column_id: originColumn.id });
    return cardsResponse.data.find(card => card.content_url === issue_url);
};
const getOriginColumn = (columns, project_origin_column_name) => columns.data.find(column => column.name === project_origin_column_name);


/***/ }),

/***/ 6590:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ octokit),
/* harmony export */   n: () => (/* binding */ octokitGraphql)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1806);
/* harmony import */ var _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3228);
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

/***/ 6315:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   V: () => (/* binding */ getProjectColumns),
/* harmony export */   x: () => (/* binding */ getDestinationColumn)
/* harmony export */ });
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6590);
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


const getProjectColumns = async ({ project_name }) => {
    const projectList = await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.projects.listForRepo({ state: 'open', per_page: 100, ..._actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo });
    const project = findProjectToModify(projectList, project_name);
    if (!project) {
        return null;
    }
    return _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.projects.listColumns({ project_id: project.id, per_page: 100 });
};
const findProjectToModify = (projectsResponse, project_name) => projectsResponse.data.find(project => project.name === project_name);
const getDestinationColumn = (columns, project_destination_column_name) => columns.data.find(column => column.name === project_destination_column_name);


/***/ })

};

//# sourceMappingURL=551.index.js.map