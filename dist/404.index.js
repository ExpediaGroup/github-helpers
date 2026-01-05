export const id = 404;
export const ids = [404];
export const modules = {

/***/ 2404:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IsUserCoreMember: () => (/* binding */ IsUserCoreMember),
/* harmony export */   isUserCoreMember: () => (/* binding */ isUserCoreMember)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_get_core_member_logins__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5587);
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




class IsUserCoreMember extends _types_generated__WEBPACK_IMPORTED_MODULE_3__/* .HelperInputs */ .m {
}
const isUserCoreMember = async ({ pull_number, login = _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.actor, codeowners_overrides }) => {
    const pullNumber = Number(pull_number);
    const coreMembers = await (0,_utils_get_core_member_logins__WEBPACK_IMPORTED_MODULE_2__/* .getCoreMemberLogins */ .u)({ pull_number: pullNumber, codeowners_overrides });
    _actions_core__WEBPACK_IMPORTED_MODULE_1__.info(`Checking if ${login} is a core member for pull request ${pullNumber}`);
    _actions_core__WEBPACK_IMPORTED_MODULE_1__.info(`Core members: ${coreMembers.join(', ')}`);
    return coreMembers.includes(login);
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
}


/***/ }),

/***/ 6668:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   j: () => (/* binding */ convertToTeamSlug)
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
const convertToTeamSlug = (codeOwner) => codeOwner.substring(codeOwner.indexOf('/') + 1);


/***/ }),

/***/ 8420:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   t: () => (/* binding */ getChangedFilepaths)
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
        ..._actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo
    });
    if (!response.data.length) {
        return [];
    }
    return response.data.concat(await paginateAllChangedFilepaths(pull_number, page + 1));
};


/***/ }),

/***/ 5587:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D: () => (/* binding */ getRequiredCodeOwnersEntries),
/* harmony export */   u: () => (/* binding */ getCoreMemberLogins)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var codeowners_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9409);
/* harmony import */ var codeowners_utils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(codeowners_utils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2356);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _get_changed_filepaths__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8420);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4366);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _convert_to_team_slug__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6668);
/* harmony import */ var _paginate_members_in_org__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2275);
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







const getCoreMemberLogins = async (params) => {
    const { pull_number, teams, codeowners_overrides } = params;
    const codeOwners = teams ?? getCodeOwnersFromEntries(await getRequiredCodeOwnersEntries(pull_number, codeowners_overrides));
    const teamsAndLogins = await getCoreTeamsAndLogins(codeOwners);
    return (0,lodash__WEBPACK_IMPORTED_MODULE_2__.uniq)(teamsAndLogins.map(({ login }) => login));
};
const getRequiredCodeOwnersEntries = async (pull_number, codeowners_overrides) => {
    let codeOwners = (await (0,codeowners_utils__WEBPACK_IMPORTED_MODULE_1__.loadOwners)(process.cwd())) ?? [];
    if (codeowners_overrides) {
        const unmatchedOverrides = [];
        codeowners_overrides.split(',').forEach(overrideString => {
            const [pattern, ...owners] = overrideString.split(/\s+/);
            if (!pattern) {
                _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed('Invalid code_owners_override format. Please provide a comma-separated list of lines in GitHub CODEOWNERS format. For example, "/foo @owner1 @owner2,/bar @owner3".');
                throw new Error();
            }
            // Replace exact pattern matches with overrides
            const patternMatched = codeOwners.some((originalEntry, index) => {
                if (originalEntry.pattern === pattern) {
                    codeOwners[index] = { pattern, owners };
                    return true;
                }
                return false;
            });
            // Queue up unmatched overrides
            if (!patternMatched) {
                unmatchedOverrides.push({ pattern, owners });
            }
        });
        // Append remaining overrides to the end of the list
        // Note: codeowners-utils ordering is the reverse of the CODEOWNERS file
        codeOwners = unmatchedOverrides.toReversed().concat(codeOwners);
    }
    const changedFilePaths = await (0,_get_changed_filepaths__WEBPACK_IMPORTED_MODULE_3__/* .getChangedFilepaths */ .t)(pull_number);
    return changedFilePaths.map(filePath => (0,codeowners_utils__WEBPACK_IMPORTED_MODULE_1__.matchFile)(filePath, codeOwners)).filter(Boolean);
};
const getCoreTeamsAndLogins = async (codeOwners) => {
    if (!codeOwners?.length) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed('No code owners found. Please provide a "teams" input or set up a CODEOWNERS file in your repo.');
        throw new Error();
    }
    const teamsAndLogins = await (0,bluebird__WEBPACK_IMPORTED_MODULE_4__.map)(codeOwners, async (team) => (0,_paginate_members_in_org__WEBPACK_IMPORTED_MODULE_5__/* .paginateMembersInOrg */ .c)(team).then(members => members.map(({ login }) => ({ team, login }))));
    return (0,lodash__WEBPACK_IMPORTED_MODULE_2__.union)(...teamsAndLogins);
};
const getCodeOwnersFromEntries = (codeOwnersEntries) => {
    return (0,lodash__WEBPACK_IMPORTED_MODULE_2__.uniq)(codeOwnersEntries
        .map(entry => entry.owners)
        .flat()
        .filter(Boolean)
        .map(codeOwner => (0,_convert_to_team_slug__WEBPACK_IMPORTED_MODULE_6__/* .convertToTeamSlug */ .j)(codeOwner)));
};


/***/ }),

/***/ 2275:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ paginateMembersInOrg)
/* harmony export */ });
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6590);
/* harmony import */ var _convert_to_team_slug__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6668);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);
/*
Copyright 2025 Expedia, Inc.
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



const paginateMembersInOrg = async (team, page = 1) => {
    const response = await _octokit__WEBPACK_IMPORTED_MODULE_0__/* .octokit */ .A.teams.listMembersInOrg({
        org: _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo.owner,
        team_slug: (0,_convert_to_team_slug__WEBPACK_IMPORTED_MODULE_2__/* .convertToTeamSlug */ .j)(team),
        per_page: 100,
        page
    });
    if (!response?.data?.length) {
        return [];
    }
    // If the response size is less than 100, we have reached the end of the pagination
    if (response.data.length < 100) {
        return response.data;
    }
    return [...response.data, ...(await paginateMembersInOrg(team, page + 1))];
};


/***/ })

};

//# sourceMappingURL=404.index.js.map