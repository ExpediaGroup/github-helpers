"use strict";
exports.id = 153;
exports.ids = [153];
exports.modules = {

/***/ 2153:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AssignPrReviewer": () => (/* binding */ AssignPrReviewer),
/* harmony export */   "assignPrReviewers": () => (/* binding */ assignPrReviewers)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_get_core_member_logins__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7290);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8710);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils_notify_user__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9938);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6161);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(250);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_6__);
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







class AssignPrReviewer {
}
const assignPrReviewers = ({ teams, login, number_of_assignees = '1', slack_webhook_url, pull_number = _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.issue.number }) => __awaiter(void 0, void 0, void 0, function* () {
    const coreMemberLogins = yield (0,_utils_get_core_member_logins__WEBPACK_IMPORTED_MODULE_2__/* .getCoreMemberLogins */ .c)(_actions_github__WEBPACK_IMPORTED_MODULE_1__.context.issue.number, teams === null || teams === void 0 ? void 0 : teams.split('\n'));
    if (login && coreMemberLogins.includes(login)) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info('Already a core member, no need to assign.');
        return;
    }
    const assignees = (0,lodash__WEBPACK_IMPORTED_MODULE_6__.sampleSize)(coreMemberLogins, Number(number_of_assignees));
    yield _octokit__WEBPACK_IMPORTED_MODULE_5__/* .octokit.issues.addAssignees */ .K.issues.addAssignees(Object.assign({ assignees, issue_number: pull_number }, _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo));
    if (slack_webhook_url) {
        return (0,bluebird__WEBPACK_IMPORTED_MODULE_3__.map)(assignees, (assignee) => __awaiter(void 0, void 0, void 0, function* () {
            return (0,_utils_notify_user__WEBPACK_IMPORTED_MODULE_4__/* .notifyUser */ .b)({
                login: assignee,
                pull_number,
                slack_webhook_url
            });
        }));
    }
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


const getChangedFilepaths = (pull_number) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit.pulls.listFiles */ .K.pulls.listFiles(Object.assign({ pull_number, per_page: 100 }, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo));
    return data.map(file => file.filename);
});


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
    const adminLogins = yield (0,bluebird__WEBPACK_IMPORTED_MODULE_5__.map)(codeOwners, (team) => __awaiter(void 0, void 0, void 0, function* () {
        return _octokit__WEBPACK_IMPORTED_MODULE_6__/* .octokit.teams.listMembersInOrg */ .K.teams.listMembersInOrg({
            org: _actions_github__WEBPACK_IMPORTED_MODULE_3__.context.repo.owner,
            team_slug: team,
            per_page: 100
        })
            .then(listMembersResponse => listMembersResponse.data.map(member => member.login));
    }));
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


/***/ }),

/***/ 9938:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "b": () => (/* binding */ notifyUser)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6545);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
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




const notifyUser = ({ login, pull_number, slack_webhook_url }) => __awaiter(void 0, void 0, void 0, function* () {
    const { data: { email } } = yield _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit.users.getByUsername */ .K.users.getByUsername({ username: login });
    if (!email) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`No github email found for user ${login}. Ensure you have set your email to be publicly visible on your Github profile.`);
        return;
    }
    const { data: { title, html_url } } = yield _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit.pulls.get */ .K.pulls.get(Object.assign({ pull_number }, _actions_github__WEBPACK_IMPORTED_MODULE_2__.context.repo));
    const { data } = yield axios__WEBPACK_IMPORTED_MODULE_1___default().post(slack_webhook_url, {
        assignee: email,
        title,
        html_url,
        repo: _actions_github__WEBPACK_IMPORTED_MODULE_2__.context.repo.repo
    });
    return data;
});


/***/ })

};
;
//# sourceMappingURL=153.index.js.map