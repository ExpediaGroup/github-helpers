"use strict";
exports.id = 671;
exports.ids = [671];
exports.modules = {

/***/ 9042:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$9": () => (/* binding */ DEFAULT_PIPELINE_STATUS),
/* harmony export */   "Ak": () => (/* binding */ READY_FOR_MERGE_PR_LABEL),
/* harmony export */   "CA": () => (/* binding */ PRIORITY_4),
/* harmony export */   "Cb": () => (/* binding */ MERGE_QUEUE_STATUS),
/* harmony export */   "Cc": () => (/* binding */ GITHUB_OPTIONS),
/* harmony export */   "Ee": () => (/* binding */ QUEUED_FOR_MERGE_PREFIX),
/* harmony export */   "HW": () => (/* binding */ DEFAULT_PR_TITLE_REGEX),
/* harmony export */   "Hc": () => (/* binding */ PRODUCTION_ENVIRONMENT),
/* harmony export */   "IH": () => (/* binding */ FIRST_QUEUED_PR_LABEL),
/* harmony export */   "Km": () => (/* binding */ DEFAULT_PIPELINE_DESCRIPTION),
/* harmony export */   "N5": () => (/* binding */ PRIORITY_1),
/* harmony export */   "Xt": () => (/* binding */ PEER_APPROVED_PR_LABEL),
/* harmony export */   "Yc": () => (/* binding */ PRIORITY_3),
/* harmony export */   "_d": () => (/* binding */ CORE_APPROVED_PR_LABEL),
/* harmony export */   "aT": () => (/* binding */ ALMOST_OVERDUE_ISSUE),
/* harmony export */   "eK": () => (/* binding */ PRIORITY_2),
/* harmony export */   "fy": () => (/* binding */ LATE_REVIEW),
/* harmony export */   "nJ": () => (/* binding */ JUMP_THE_QUEUE_PR_LABEL),
/* harmony export */   "wH": () => (/* binding */ OVERDUE_ISSUE)
/* harmony export */ });
/* unused harmony exports DEFAULT_EXEMPT_DESCRIPTION, COPYRIGHT_HEADER */
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
const DEFAULT_EXEMPT_DESCRIPTION = 'Passed in case the check is exempt.';
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

/***/ 5671:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "ManageIssueDueDates": () => (/* binding */ ManageIssueDueDates),
  "manageIssueDueDates": () => (/* binding */ manageIssueDueDates)
});

// EXTERNAL MODULE: ./src/constants.ts
var constants = __webpack_require__(9042);
// EXTERNAL MODULE: ./src/types/generated.ts
var generated = __webpack_require__(3476);
// EXTERNAL MODULE: ./src/octokit.ts
var octokit = __webpack_require__(6161);
// EXTERNAL MODULE: ./node_modules/@actions/github/lib/github.js
var github = __webpack_require__(5438);
;// CONCATENATED MODULE: ./src/utils/paginate-open-issues.ts
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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const paginateAllOpenIssues = (priorityLabels, page = 1) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield octokit/* octokit.issues.listForRepo */.K.issues.listForRepo(Object.assign({ state: 'open', labels: priorityLabels, sort: 'created', direction: 'desc', per_page: 100, page }, github.context.repo));
    if (!response || !response.data.length) {
        return [];
    }
    return response.data.concat(yield paginateAllOpenIssues(priorityLabels, page + 1));
});

;// CONCATENATED MODULE: ./src/utils/add-overdue-labels.ts


const addOverdueLabel = (priority, createdDate, issue_number, assignee, warningThreshold, almostOverdueLabel, overdueLabel, priorityLabels) => {
    const SLAGuidelines = {
        [priorityLabels[0]]: 2,
        [priorityLabels[1]]: 14,
        [priorityLabels[2]]: 45,
        [priorityLabels[3]]: 90
    };
    const daysSinceCreation = Math.ceil((Date.now() - createdDate.getTime()) / 86400000);
    const labelToAdd = daysSinceCreation > SLAGuidelines[priority]
        ? overdueLabel
        : daysSinceCreation > SLAGuidelines[priority] - warningThreshold
            ? almostOverdueLabel
            : '';
    if (labelToAdd.length) {
        assignee &&
            octokit/* octokit.issues.createComment */.K.issues.createComment(Object.assign({ issue_number, body: `@${assignee}, this issue assigned to you is now ${labelToAdd.toLowerCase()}` }, github.context.repo));
        octokit/* octokit.issues.addLabels */.K.issues.addLabels(Object.assign({ labels: [labelToAdd], issue_number }, github.context.repo));
    }
};

;// CONCATENATED MODULE: ./src/utils/paginate-comments-on-issue.ts
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
var paginate_comments_on_issue_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const paginateAllCommentsOnIssue = (issue_number, page = 1) => paginate_comments_on_issue_awaiter(void 0, void 0, void 0, function* () {
    const response = yield octokit/* octokit.issues.listComments */.K.issues.listComments(Object.assign({ issue_number, sort: 'created', direction: 'desc', per_page: 100, page }, github.context.repo));
    if (!response.data.length) {
        return [];
    }
    return response.data.concat(yield paginateAllCommentsOnIssue(issue_number, page + 1));
});

;// CONCATENATED MODULE: ./src/utils/add-due-date-comment.ts
var add_due_date_comment_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



const addDueDateComment = (deadline, createdDate, issue_number, hasExistingComments) => add_due_date_comment_awaiter(void 0, void 0, void 0, function* () {
    const commentList = hasExistingComments ? yield paginateAllCommentsOnIssue(issue_number) : [];
    // Create due date comment if there are no existing comments or the comment list does not contain a due date comment
    if (!hasExistingComments || commentList.findIndex((comment) => { var _a; return (_a = comment.body) === null || _a === void 0 ? void 0 : _a.startsWith('This issue is due on'); }) === -1) {
        const dueDate = new Date(createdDate.getTime() + deadline * 86400000);
        yield octokit/* octokit.issues.createComment */.K.issues.createComment(Object.assign({ issue_number, body: `This issue is due on ${dueDate.toDateString()}` }, github.context.repo));
    }
});

// EXTERNAL MODULE: ./node_modules/bluebird/js/release/bluebird.js
var bluebird = __webpack_require__(8710);
;// CONCATENATED MODULE: ./src/helpers/manage-issue-due-dates.ts
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
var manage_issue_due_dates_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






class ManageIssueDueDates extends generated/* HelperInputs */.s {
}
const manageIssueDueDates = ({ warningThreshold = '7', almostOverdueLabel = constants/* ALMOST_OVERDUE_ISSUE */.aT, overdueLabel = constants/* OVERDUE_ISSUE */.wH, customPriorityLabels = [constants/* PRIORITY_1 */.N5, constants/* PRIORITY_2 */.eK, constants/* PRIORITY_3 */.Yc, constants/* PRIORITY_4 */.CA].join() }) => manage_issue_due_dates_awaiter(void 0, void 0, void 0, function* () {
    const priorityLabels = customPriorityLabels.split(',');
    const openIssues = yield paginateAllOpenIssues(customPriorityLabels);
    const getPriorityLabel = (labels) => {
        if (labels) {
            for (const priorityLabel of priorityLabels) {
                // Label can either be a string or an object with a 'name' property
                if (labels.find(label => (label.name || label) === priorityLabel) !== undefined)
                    return priorityLabel;
            }
        }
        // no priority label was found
        return '';
    };
    yield (0,bluebird.map)(openIssues, (issue) => manage_issue_due_dates_awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { labels: issueLabels, created_at, assignee, number: issue_number, comments } = issue;
        const priority = getPriorityLabel(issueLabels);
        if (priority.length) {
            const createdDate = new Date(created_at);
            const assigneeName = typeof assignee === 'string' ? assignee : (_a = assignee === null || assignee === void 0 ? void 0 : assignee.name) !== null && _a !== void 0 ? _a : '';
            const daysOpenBasedOnPriority = {
                [priorityLabels[0]]: 2,
                [priorityLabels[1]]: 14,
                [priorityLabels[2]]: 45,
                [priorityLabels[3]]: 90
            };
            addOverdueLabel(priority, createdDate, issue_number, assigneeName, Number(warningThreshold), almostOverdueLabel, overdueLabel, priorityLabels);
            yield addDueDateComment(daysOpenBasedOnPriority[priority], createdDate, issue_number, comments > 0);
        }
    }));
});


/***/ }),

/***/ 6161:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "K": () => (/* binding */ octokit),
/* harmony export */   "o": () => (/* binding */ octokitGraphql)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3006);
/* harmony import */ var _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5438);
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

/***/ 3476:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "s": () => (/* binding */ HelperInputs)
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


/***/ })

};
;
//# sourceMappingURL=671.index.js.map