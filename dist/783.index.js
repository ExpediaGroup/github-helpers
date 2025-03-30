export const id = 783;
export const ids = [783];
export const modules = {

/***/ 8783:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IsUserInTeam: () => (/* binding */ IsUserInTeam),
/* harmony export */   isUserInTeam: () => (/* binding */ isUserInTeam)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6590);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_2__);
/*
Copyright 2023 Expedia, Inc.
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




class IsUserInTeam extends _types_generated__WEBPACK_IMPORTED_MODULE_3__/* .HelperInputs */ .m {
    team = '';
}
const isUserInTeam = async ({ login = _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.actor, team }) => {
    const members = await paginateAllMembersInOrg(team);
    _actions_core__WEBPACK_IMPORTED_MODULE_2__.info(`Checking if ${login} is in team ${team}`);
    _actions_core__WEBPACK_IMPORTED_MODULE_2__.info(`Team members: ${members.map(({ login }) => login).join(', ')}`);
    return members.some(({ login: memberLogin }) => memberLogin === login);
};
async function paginateAllMembersInOrg(team, page = 1) {
    const response = await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.teams.listMembersInOrg({
        org: _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.owner,
        team_slug: team,
        page,
        per_page: 100
    });
    if (!response.data.length) {
        return [];
    }
    return response.data.concat(await paginateAllMembersInOrg(team, page + 1));
}


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


/***/ })

};

//# sourceMappingURL=783.index.js.map