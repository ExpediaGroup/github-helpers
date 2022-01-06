"use strict";
exports.id = 154;
exports.ids = [154];
exports.modules = {

/***/ 3154:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "assignPrReviewers": () => (/* binding */ assignPrReviewers)
});

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js
var core = __webpack_require__(2186);
// EXTERNAL MODULE: ./node_modules/@actions/github/lib/github.js
var github = __webpack_require__(5438);
// EXTERNAL MODULE: ./src/utils/get-core-member-logins.ts
var get_core_member_logins = __webpack_require__(7290);
// EXTERNAL MODULE: ./node_modules/bluebird/js/release/bluebird.js
var bluebird = __webpack_require__(8710);
// EXTERNAL MODULE: ./node_modules/axios/index.js
var axios = __webpack_require__(6545);
var axios_default = /*#__PURE__*/__webpack_require__.n(axios);
// EXTERNAL MODULE: ./src/octokit.ts
var octokit = __webpack_require__(6161);
;// CONCATENATED MODULE: ./src/utils/notify-reviewer.ts
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




const notifyReviewer = ({ login, pull_number, slack_webhook_url }) => __awaiter(void 0, void 0, void 0, function* () {
    const assigneeResponse = yield octokit/* octokit.users.getByUsername */.K.users.getByUsername({ username: login });
    const assigneeEmail = assigneeResponse.data.email;
    if (!assigneeEmail) {
        core.setFailed(`No github email found for user ${login}. Ensure you have set your email to be publicly visible on your Github profile.`);
        throw new Error();
    }
    const pullRequestResponse = yield octokit/* octokit.pulls.get */.K.pulls.get(Object.assign({ pull_number }, github.context.repo));
    const { title, html_url } = pullRequestResponse.data;
    const slackResponse = yield axios_default().post(slack_webhook_url, {
        assignee: assigneeEmail,
        title,
        html_url,
        repo: github.context.repo.repo
    });
    return slackResponse.data;
});

// EXTERNAL MODULE: ./node_modules/lodash/lodash.js
var lodash = __webpack_require__(250);
;// CONCATENATED MODULE: ./src/helpers/assign-pr-reviewers.ts
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
var assign_pr_reviewers_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







const assignPrReviewers = ({ teams, login, number_of_assignees = '1', slack_webhook_url }) => assign_pr_reviewers_awaiter(void 0, void 0, void 0, function* () {
    const coreMemberLogins = yield (0,get_core_member_logins/* getCoreMemberLogins */.c)(github.context.issue.number, teams === null || teams === void 0 ? void 0 : teams.split('\n'));
    if (login && coreMemberLogins.includes(login)) {
        core.info('Already a core member, no need to assign.');
        return;
    }
    const assignees = (0,lodash.sampleSize)(coreMemberLogins, Number(number_of_assignees));
    return octokit/* octokit.issues.addAssignees */.K.issues.addAssignees(Object.assign({ assignees, issue_number: github.context.issue.number }, github.context.repo))
        .then(() => {
        if (slack_webhook_url) {
            return (0,bluebird.map)(assignees, assignee => notifyReviewer({
                login: assignee,
                pull_number: github.context.issue.number,
                slack_webhook_url
            }));
        }
    });
});


/***/ }),

/***/ 6161:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ 9180:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "s": () => (/* binding */ getChangedFilepaths)
/* harmony export */ });
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6161);


const getChangedFilepaths = (pull_number) => _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit.pulls.listFiles */ .K.pulls.listFiles(Object.assign({ pull_number, per_page: 100 }, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo))
    .then(listFilesResponse => listFilesResponse.data.map(file => file.filename));


/***/ }),

/***/ 7290:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "c": () => (/* binding */ getCoreMemberLogins)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var codeowners_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4445);
/* harmony import */ var codeowners_utils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(codeowners_utils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(250);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _get_changed_filepaths__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9180);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8710);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6161);
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







const getCoreMemberLogins = (pull_number, teams) => __awaiter(void 0, void 0, void 0, function* () {
    const codeOwners = teams !== null && teams !== void 0 ? teams : (yield getCodeOwners(pull_number));
    if (!(codeOwners === null || codeOwners === void 0 ? void 0 : codeOwners.length)) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed('No code owners found.');
        throw new Error();
    }
    const adminLogins = yield (0,bluebird__WEBPACK_IMPORTED_MODULE_5__.map)(codeOwners, team => _octokit__WEBPACK_IMPORTED_MODULE_6__/* .octokit.teams.listMembersInOrg */ .K.teams.listMembersInOrg({
        org: _actions_github__WEBPACK_IMPORTED_MODULE_3__.context.repo.owner,
        team_slug: team,
        per_page: 100
    })
        .then(listMembersResponse => listMembersResponse.data.map(member => member.login)));
    return (0,lodash__WEBPACK_IMPORTED_MODULE_2__.union)(...adminLogins);
});
const getCodeOwners = (pull_number) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const codeOwners = (_a = (yield (0,codeowners_utils__WEBPACK_IMPORTED_MODULE_1__.loadOwners)(process.cwd()))) !== null && _a !== void 0 ? _a : [];
    const changedFilePaths = yield (0,_get_changed_filepaths__WEBPACK_IMPORTED_MODULE_4__/* .getChangedFilepaths */ .s)(pull_number);
    const matchingCodeOwners = changedFilePaths.map(filePath => { var _a; return (_a = (0,codeowners_utils__WEBPACK_IMPORTED_MODULE_1__.matchFile)(filePath, codeOwners)) !== null && _a !== void 0 ? _a : {}; });
    return (0,lodash__WEBPACK_IMPORTED_MODULE_2__.uniq)(matchingCodeOwners
        .map(owner => owner.owners)
        .flat()
        .filter(Boolean)
        .map(owner => owner.substring(owner.indexOf('/') + 1)));
});


/***/ })

};
;
//# sourceMappingURL=154.index.js.map