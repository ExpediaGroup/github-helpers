export const id = 928;
export const ids = [928];
export const modules = {

/***/ 7242:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   E$: () => (/* binding */ PRODUCTION_ENVIRONMENT),
/* harmony export */   E3: () => (/* binding */ DEFAULT_PIPELINE_DESCRIPTION),
/* harmony export */   E5: () => (/* binding */ DEFAULT_PR_TITLE_REGEX),
/* harmony export */   In: () => (/* binding */ ALMOST_OVERDUE_ISSUE),
/* harmony export */   KE: () => (/* binding */ QUEUED_FOR_MERGE_PREFIX),
/* harmony export */   Md: () => (/* binding */ DEFAULT_PIPELINE_STATUS),
/* harmony export */   Nj: () => (/* binding */ OVERDUE_ISSUE),
/* harmony export */   PX: () => (/* binding */ SECONDS_IN_A_DAY),
/* harmony export */   Qc: () => (/* binding */ LATE_REVIEW),
/* harmony export */   Qw: () => (/* binding */ MERGE_QUEUE_STATUS),
/* harmony export */   RB: () => (/* binding */ FIRST_QUEUED_PR_LABEL),
/* harmony export */   XD: () => (/* binding */ PEER_APPROVED_PR_LABEL),
/* harmony export */   ZV: () => (/* binding */ READY_FOR_MERGE_PR_LABEL),
/* harmony export */   hU: () => (/* binding */ JUMP_THE_QUEUE_PR_LABEL),
/* harmony export */   mR: () => (/* binding */ PRIORITY_TO_DAYS_MAP),
/* harmony export */   r0: () => (/* binding */ GITHUB_OPTIONS),
/* harmony export */   uJ: () => (/* binding */ CORE_APPROVED_PR_LABEL),
/* harmony export */   zh: () => (/* binding */ PRIORITY_LABELS)
/* harmony export */ });
/* unused harmony exports PRIORITY_1, PRIORITY_2, PRIORITY_3, PRIORITY_4, COPYRIGHT_HEADER */
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
// These extra headers are for experimental API features on Github Enterprise. See https://docs.github.com/en/enterprise-server@3.0/rest/overview/api-previews for details.
const PREVIEWS = ['ant-man', 'flash', 'groot', 'inertia', 'starfox'];
const GITHUB_OPTIONS = {
    headers: {
        accept: PREVIEWS.map(preview => `application/vnd.github.${preview}-preview+json`).join()
    }
};
const SECONDS_IN_A_DAY = 86400000;
const DEFAULT_PIPELINE_STATUS = 'Pipeline Status';
const DEFAULT_PIPELINE_DESCRIPTION = 'Pipeline clear.';
const PRODUCTION_ENVIRONMENT = 'production';
const LATE_REVIEW = 'Late Review';
const OVERDUE_ISSUE = 'Overdue';
const ALMOST_OVERDUE_ISSUE = 'Due Soon';
const PRIORITY_1 = 'Priority: Critical';
const PRIORITY_2 = 'Priority: High';
const PRIORITY_3 = 'Priority: Medium';
const PRIORITY_4 = 'Priority: Low';
const PRIORITY_LABELS = [PRIORITY_1, PRIORITY_2, PRIORITY_3, PRIORITY_4];
const PRIORITY_TO_DAYS_MAP = {
    [PRIORITY_1]: 2,
    [PRIORITY_2]: 14,
    [PRIORITY_3]: 45,
    [PRIORITY_4]: 90
};
const CORE_APPROVED_PR_LABEL = 'CORE APPROVED';
const PEER_APPROVED_PR_LABEL = 'PEER APPROVED';
const READY_FOR_MERGE_PR_LABEL = 'READY FOR MERGE';
const MERGE_QUEUE_STATUS = 'QUEUE CHECKER';
const QUEUED_FOR_MERGE_PREFIX = 'QUEUED FOR MERGE';
const FIRST_QUEUED_PR_LABEL = `${QUEUED_FOR_MERGE_PREFIX} #1`;
const JUMP_THE_QUEUE_PR_LABEL = 'JUMP THE QUEUE';
const DEFAULT_PR_TITLE_REGEX = '^(build|ci|chore|docs|feat|fix|perf|refactor|style|test|revert|Revert|BREAKING CHANGE)((.*))?: .+$';
const COPYRIGHT_HEADER = (/* unused pure expression or super */ null && (`/*
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
*/`));


/***/ }),

/***/ 4928:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CreateProjectCardProps: () => (/* binding */ CreateProjectCardProps),
/* harmony export */   createProjectCard: () => (/* binding */ createProjectCard)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_get_project_columns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6315);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7242);
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6590);
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






class CreateProjectCardProps extends _types_generated__WEBPACK_IMPORTED_MODULE_5__/* .HelperInputs */ .m {
    project_name = '';
    project_destination_column_name = '';
}
const createProjectCard = async ({ project_name, project_destination_column_name, note }) => {
    const columnsList = await (0,_utils_get_project_columns__WEBPACK_IMPORTED_MODULE_1__/* .getProjectColumns */ .V)({ project_name });
    if (!columnsList?.data?.length) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.error(`There are no columns associated to ${project_name} project.`);
        return;
    }
    const destinationColumn = (0,_utils_get_project_columns__WEBPACK_IMPORTED_MODULE_1__/* .getDestinationColumn */ .x)(columnsList, project_destination_column_name);
    if (!destinationColumn) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info('No destination column was found');
        return;
    }
    const cardParams = await generateCardParams(destinationColumn, note);
    return _octokit__WEBPACK_IMPORTED_MODULE_4__/* .octokit */ .A.projects.createCard(cardParams);
};
const generateCardParams = async (filteredColumn, note) => {
    const getResponse = await _octokit__WEBPACK_IMPORTED_MODULE_4__/* .octokit */ .A.pulls.get({ pull_number: _actions_github__WEBPACK_IMPORTED_MODULE_3__.context.issue.number, ..._actions_github__WEBPACK_IMPORTED_MODULE_3__.context.repo });
    const pullRequest = getResponse.data;
    if (note) {
        return {
            column_id: filteredColumn?.id,
            note,
            ..._actions_github__WEBPACK_IMPORTED_MODULE_3__.context.repo,
            ..._constants__WEBPACK_IMPORTED_MODULE_2__/* .GITHUB_OPTIONS */ .r0
        };
    }
    return {
        column_id: filteredColumn.id,
        content_id: pullRequest.id,
        content_type: 'PullRequest',
        ..._actions_github__WEBPACK_IMPORTED_MODULE_3__.context.repo,
        ..._constants__WEBPACK_IMPORTED_MODULE_2__/* .GITHUB_OPTIONS */ .r0
    };
};


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
    helper;
    github_token;
    body;
    project_name;
    project_destination_column_name;
    note;
    project_origin_column_name;
    sha;
    context;
    state;
    description;
    target_url;
    environment;
    environment_url;
    label;
    labels;
    paths;
    ignore_globs;
    override_filter_paths;
    batches;
    pattern;
    teams;
    users;
    login;
    paths_no_filter;
    slack_webhook_url;
    number_of_assignees;
    number_of_reviewers;
    globs;
    override_filter_globs;
    title;
    seconds;
    pull_number;
    base;
    head;
    days;
    no_evict_upon_conflict;
    skip_if_already_set;
    delimiter;
    team;
    ignore_deleted;
    return_full_payload;
    skip_auto_merge;
    repo_name;
    repo_owner_name;
    load_balancing_sizes;
    required_review_overrides;
    codeowners_overrides;
    max_queue_size;
    allow_only_for_maintainers;
    use_basic_matrix_configuration;
    merge_queue_enabled;
}


/***/ }),

/***/ 6315:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   V: () => (/* binding */ getProjectColumns),
/* harmony export */   x: () => (/* binding */ getDestinationColumn)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7242);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6590);
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
    const projectList = await _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit */ .A.projects.listForRepo({ state: 'open', per_page: 100, ..._actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo, ..._constants__WEBPACK_IMPORTED_MODULE_0__/* .GITHUB_OPTIONS */ .r0 });
    const project = findProjectToModify(projectList, project_name);
    if (!project) {
        return null;
    }
    return _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit */ .A.projects.listColumns({ project_id: project.id, per_page: 100, ..._constants__WEBPACK_IMPORTED_MODULE_0__/* .GITHUB_OPTIONS */ .r0 });
};
const findProjectToModify = (projectsResponse, project_name) => projectsResponse.data.find(project => project.name === project_name);
const getDestinationColumn = (columns, project_destination_column_name) => columns.data.find(column => column.name === project_destination_column_name);


/***/ })

};

//# sourceMappingURL=928.index.js.map