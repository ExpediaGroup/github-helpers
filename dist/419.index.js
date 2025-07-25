export const id = 419;
export const ids = [419,280];
export const modules = {

/***/ 419:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ApprovalsSatisfied: () => (/* binding */ ApprovalsSatisfied),
  approvalsSatisfied: () => (/* binding */ approvalsSatisfied)
});

// EXTERNAL MODULE: ./src/types/generated.ts
var generated = __webpack_require__(8428);
// EXTERNAL MODULE: ./node_modules/@actions/github/lib/github.js
var github = __webpack_require__(3228);
// EXTERNAL MODULE: ./src/utils/get-core-member-logins.ts
var get_core_member_logins = __webpack_require__(5587);
// EXTERNAL MODULE: ./node_modules/bluebird/js/release/bluebird.js
var bluebird = __webpack_require__(4366);
// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js
var core = __webpack_require__(7484);
// EXTERNAL MODULE: ./src/octokit.ts
var octokit = __webpack_require__(6590);
;// CONCATENATED MODULE: ./src/utils/paginate-all-reviews.ts
/*
Copyright 2022 Expedia, Inc.
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


const paginateAllReviews = async (prNumber, page = 1) => {
    const response = await octokit/* octokit */.A.pulls.listReviews({
        pull_number: prNumber,
        per_page: 100,
        page,
        ...github.context.repo
    });
    if (!response.data.length) {
        return [];
    }
    return response.data.concat(await paginateAllReviews(prNumber, page + 1));
};

// EXTERNAL MODULE: ./node_modules/lodash/lodash.js
var lodash = __webpack_require__(2356);
// EXTERNAL MODULE: ./src/helpers/create-pr-comment.ts
var create_pr_comment = __webpack_require__(9280);
// EXTERNAL MODULE: ./src/utils/convert-to-team-slug.ts
var convert_to_team_slug = __webpack_require__(6668);
;// CONCATENATED MODULE: ./src/utils/paginate-members-in-org.ts
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
    const response = await octokit/* octokit */.A.teams.listMembersInOrg({
        org: github.context.repo.owner,
        team_slug: (0,convert_to_team_slug/* convertToTeamSlug */.j)(team),
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

;// CONCATENATED MODULE: ./src/helpers/approvals-satisfied.ts
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









class ApprovalsSatisfied extends generated/* HelperInputs */.m {
}
const approvalsSatisfied = async ({ teams, users, codeowners_overrides, number_of_reviewers = '1', required_review_overrides, pull_number, body } = {}) => {
    const prNumber = pull_number ? Number(pull_number) : github.context.issue.number;
    const teamOverrides = required_review_overrides?.split(',').map(overrideString => {
        const [team, numberOfRequiredReviews] = overrideString.split(':');
        return { team, numberOfRequiredReviews };
    });
    const teamsList = updateTeamsList(teams?.split('\n'));
    if (!validateTeamsList(teamsList)) {
        core.setFailed('If teams input is in the format "org/team", then the org must be the same as the repository org');
        return false;
    }
    const usersList = users?.split('\n');
    const logs = [];
    const reviews = await paginateAllReviews(prNumber);
    const approverLogins = reviews
        .filter(({ state }) => state === 'APPROVED')
        .map(({ user }) => user?.login)
        .filter(Boolean);
    logs.push(`PR already approved by: ${approverLogins.toString()}`);
    const requiredCodeOwnersEntries = teamsList || usersList
        ? createArtificialCodeOwnersEntry({ teams: teamsList, users: usersList })
        : await (0,get_core_member_logins/* getRequiredCodeOwnersEntries */.D)(prNumber, codeowners_overrides);
    const requiredCodeOwnersEntriesWithOwners = (0,lodash.uniqBy)(requiredCodeOwnersEntries.filter(({ owners }) => owners.length), 'owners');
    const codeOwnersEntrySatisfiesApprovals = async (entry) => {
        const loginsLists = await (0,bluebird.map)(entry.owners, async (teamOrUsers) => {
            if (isTeam(teamOrUsers)) {
                const members = await paginateMembersInOrg(teamOrUsers);
                return members.map(({ login }) => login);
            }
            else {
                return teamOrUsers.replaceAll('@', '').split(',');
            }
        });
        const codeOwnerLogins = (0,lodash.uniq)(loginsLists.flat());
        const numberOfApprovals = approverLogins.filter(login => codeOwnerLogins.includes(login)).length;
        const numberOfRequiredReviews = teamOverrides?.find(({ team }) => team && entry.owners.includes(team))?.numberOfRequiredReviews ?? number_of_reviewers;
        logs.push(`Current number of approvals satisfied for ${entry.owners}: ${numberOfApprovals}`);
        logs.push(`Number of required reviews: ${numberOfRequiredReviews}`);
        return numberOfApprovals >= Number(numberOfRequiredReviews);
    };
    if (requiredCodeOwnersEntriesWithOwners.length) {
        logs.push(`Required code owners: ${requiredCodeOwnersEntriesWithOwners.map(({ owners }) => owners).toString()}`);
    }
    const booleans = await Promise.all(requiredCodeOwnersEntriesWithOwners.map(codeOwnersEntrySatisfiesApprovals));
    const approvalsSatisfied = booleans.every(Boolean);
    if (!approvalsSatisfied) {
        logs.unshift('Required approvals not satisfied:\n');
        if (body) {
            logs.unshift(body + '\n');
            await (0,create_pr_comment.createPrComment)({
                body: logs.join('\n')
            });
        }
    }
    core.info(logs.join('\n'));
    return approvalsSatisfied;
};
const createArtificialCodeOwnersEntry = ({ teams = [], users = [] }) => [
    { owners: teams.concat(users) }
];
const isTeam = (teamOrUsers) => teamOrUsers.includes('/');
const updateTeamsList = (teamsList) => {
    return teamsList?.map(team => {
        if (!team.includes('/')) {
            return `${github.context.repo.owner}/${team}`;
        }
        else {
            return team;
        }
    });
};
const validateTeamsList = (teamsList) => {
    return (teamsList?.every(team => {
        const inputOrg = team.split('/')[0];
        return inputOrg === github.context.repo.owner;
    }) ?? true);
};


/***/ }),

/***/ 9280:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CreatePrComment: () => (/* binding */ CreatePrComment),
/* harmony export */   createPrComment: () => (/* binding */ createPrComment)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8428);
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



class CreatePrComment extends _types_generated__WEBPACK_IMPORTED_MODULE_2__/* .HelperInputs */ .m {
    body = '';
}
const emptyResponse = { data: [] };
const getFirstPrByCommit = async (sha, repo_name, repo_owner_name) => {
    const prs = (sha &&
        (await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.repos.listPullRequestsAssociatedWithCommit({
            commit_sha: sha,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.owner
        }))) ||
        emptyResponse;
    return prs.data.find(Boolean)?.number;
};
const getCommentByUser = async (login, pull_number, repo_name, repo_owner_name) => {
    const comments = (login &&
        (await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.issues.listComments({
            issue_number: pull_number ? Number(pull_number) : _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.issue.number,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.owner
        }))) ||
        emptyResponse;
    return comments.data.find(comment => comment?.user?.login === login)?.id;
};
const createPrComment = async ({ body, sha, login, pull_number, repo_name, repo_owner_name }) => {
    const defaultPrNumber = _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.issue.number;
    if (!sha && !login) {
        return _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.issues.createComment({
            body,
            issue_number: pull_number ? Number(pull_number) : defaultPrNumber,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.owner
        });
    }
    const prNumber = (await getFirstPrByCommit(sha, repo_name, repo_owner_name)) ?? (pull_number ? Number(pull_number) : defaultPrNumber);
    const commentId = await getCommentByUser(login, pull_number, repo_name, repo_owner_name);
    if (commentId) {
        return _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.issues.updateComment({
            comment_id: commentId,
            body,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.owner
        });
    }
    else {
        return _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.issues.createComment({
            body,
            issue_number: prNumber,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo.owner
        });
    }
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

/***/ 6039:
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
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _get_changed_filepaths__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6039);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4366);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6590);
/* harmony import */ var _convert_to_team_slug__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(6668);
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








const getCoreMemberLogins = async (pull_number, teams) => {
    const codeOwners = teams ?? getCodeOwnersFromEntries(await getRequiredCodeOwnersEntries(pull_number));
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
    const changedFilePaths = await (0,_get_changed_filepaths__WEBPACK_IMPORTED_MODULE_4__/* .getChangedFilepaths */ .t)(pull_number);
    return changedFilePaths.map(filePath => (0,codeowners_utils__WEBPACK_IMPORTED_MODULE_1__.matchFile)(filePath, codeOwners)).filter(Boolean);
};
const getCoreTeamsAndLogins = async (codeOwners) => {
    if (!codeOwners?.length) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed('No code owners found. Please provide a "teams" input or set up a CODEOWNERS file in your repo.');
        throw new Error();
    }
    const teamsAndLogins = await (0,bluebird__WEBPACK_IMPORTED_MODULE_5__.map)(codeOwners, async (team) => _octokit__WEBPACK_IMPORTED_MODULE_6__/* .octokit */ .A.teams
        .listMembersInOrg({
        org: _actions_github__WEBPACK_IMPORTED_MODULE_3__.context.repo.owner,
        team_slug: team,
        per_page: 100
    })
        .then(listMembersResponse => listMembersResponse.data.map(({ login }) => ({ team, login }))));
    return (0,lodash__WEBPACK_IMPORTED_MODULE_2__.union)(...teamsAndLogins);
};
const getCodeOwnersFromEntries = (codeOwnersEntries) => {
    return (0,lodash__WEBPACK_IMPORTED_MODULE_2__.uniq)(codeOwnersEntries
        .map(entry => entry.owners)
        .flat()
        .filter(Boolean)
        .map(codeOwner => (0,_convert_to_team_slug__WEBPACK_IMPORTED_MODULE_7__/* .convertToTeamSlug */ .j)(codeOwner)));
};


/***/ })

};

//# sourceMappingURL=419.index.js.map