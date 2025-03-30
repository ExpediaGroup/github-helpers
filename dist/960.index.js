export const id = 960;
export const ids = [960,598];
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

/***/ 8579:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ManageIssueDueDates: () => (/* binding */ ManageIssueDueDates),
  manageIssueDueDates: () => (/* binding */ manageIssueDueDates)
});

// EXTERNAL MODULE: ./src/constants.ts
var constants = __webpack_require__(7242);
// EXTERNAL MODULE: ./src/types/generated.ts
var generated = __webpack_require__(8428);
// EXTERNAL MODULE: ./src/octokit.ts
var octokit = __webpack_require__(6590);
// EXTERNAL MODULE: ./node_modules/@actions/github/lib/github.js
var github = __webpack_require__(3228);
// EXTERNAL MODULE: ./node_modules/bluebird/js/release/bluebird.js
var bluebird = __webpack_require__(4366);
;// CONCATENATED MODULE: ./src/utils/paginate-prioritized-issues.ts
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




const paginateAllPrioritizedIssues = async () => (await (0,bluebird.map)(constants/* PRIORITY_LABELS */.zh, async (label) => await paginateIssuesOfSpecificPriority(label))).flat();
const paginateIssuesOfSpecificPriority = async (label, page = 1) => {
    const response = await octokit/* octokit */.A.issues.listForRepo({
        state: 'open',
        sort: 'created',
        direction: 'desc',
        per_page: 100,
        labels: label,
        page,
        ...github.context.repo
    });
    if (!response?.data?.length) {
        return [];
    }
    return response.data.concat(await paginateIssuesOfSpecificPriority(label, page + 1));
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


const paginateAllCommentsOnIssue = async (issue_number, page = 1) => {
    const response = await octokit/* octokit */.A.issues.listComments({
        issue_number,
        sort: 'created',
        direction: 'desc',
        per_page: 100,
        page,
        ...github.context.repo
    });
    if (!response?.data?.length) {
        return [];
    }
    return response.data.concat(await paginateAllCommentsOnIssue(issue_number, page + 1));
};

;// CONCATENATED MODULE: ./src/utils/add-due-date-comment.ts
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




const addDueDateComment = async (deadline, createdDate, issue_number) => {
    const commentList = await paginateAllCommentsOnIssue(issue_number);
    if (!commentList?.find((comment) => comment.body?.startsWith('This issue is due on'))) {
        const dueDate = new Date(createdDate.getTime() + deadline * constants/* SECONDS_IN_A_DAY */.PX);
        await octokit/* octokit */.A.issues.createComment({
            issue_number,
            body: `This issue is due on ${dueDate.toDateString()}`,
            ...github.context.repo
        });
    }
};
const pingAssigneesForDueDate = async (assignees, labelToAdd, issue_number) => {
    const commentList = await paginateAllCommentsOnIssue(issue_number);
    assignees?.map(async (assignee) => {
        const commentToAdd = `@${assignee.name || assignee.login}, this issue assigned to you is now ${labelToAdd.toLowerCase()}`;
        if (!commentList?.find((comment) => comment.body === commentToAdd)) {
            await octokit/* octokit */.A.issues.createComment({
                issue_number,
                body: commentToAdd,
                ...github.context.repo
            });
        }
    });
};

// EXTERNAL MODULE: ./src/helpers/remove-label.ts
var remove_label = __webpack_require__(5598);
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








class ManageIssueDueDates extends generated/* HelperInputs */.m {
}
const manageIssueDueDates = async ({ days = '7' }) => {
    const openIssues = await paginateAllPrioritizedIssues();
    const warningThreshold = Number(days);
    const getFirstPriorityLabelFoundOnIssue = (issueLabels) => constants/* PRIORITY_LABELS */.zh.find(priorityLabel => issueLabels.some(issueLabel => {
        const labelName = typeof issueLabel === 'string' ? issueLabel : issueLabel.name;
        return labelName === priorityLabel;
    }));
    await (0,bluebird.map)(openIssues, async (issue) => {
        const { labels, created_at, assignees, number: issue_number } = issue;
        const priority = getFirstPriorityLabelFoundOnIssue(labels);
        const alreadyHasOverdueLabel = Boolean(labels.find(label => {
            const overdueLabels = [constants/* OVERDUE_ISSUE */.Nj];
            const labelName = typeof label === 'string' ? label : label.name || '';
            return overdueLabels.includes(labelName);
        }));
        if (!priority || alreadyHasOverdueLabel) {
            return;
        }
        const createdDate = new Date(created_at);
        const daysSinceCreation = Math.ceil((Date.now() - createdDate.getTime()) / constants/* SECONDS_IN_A_DAY */.PX);
        const deadline = constants/* PRIORITY_TO_DAYS_MAP */.mR[priority];
        await addDueDateComment(deadline, createdDate, issue_number);
        const labelToAdd = daysSinceCreation > deadline ? constants/* OVERDUE_ISSUE */.Nj : daysSinceCreation > deadline - warningThreshold ? constants/* ALMOST_OVERDUE_ISSUE */.In : undefined;
        if (labelToAdd) {
            if (assignees) {
                await pingAssigneesForDueDate(assignees, labelToAdd, issue_number);
            }
            if (labelToAdd === constants/* OVERDUE_ISSUE */.Nj) {
                await (0,remove_label.removeLabelIfExists)(constants/* ALMOST_OVERDUE_ISSUE */.In, issue_number);
            }
            await octokit/* octokit */.A.issues.addLabels({
                labels: [labelToAdd],
                issue_number,
                ...github.context.repo
            });
        }
    });
};


/***/ }),

/***/ 5598:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RemoveLabel: () => (/* binding */ RemoveLabel),
/* harmony export */   removeLabel: () => (/* binding */ removeLabel),
/* harmony export */   removeLabelIfExists: () => (/* binding */ removeLabelIfExists)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8428);
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




class RemoveLabel extends _types_generated__WEBPACK_IMPORTED_MODULE_3__/* .HelperInputs */ .m {
    label = '';
}
const removeLabel = async ({ label }) => removeLabelIfExists(label, _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.issue.number);
const removeLabelIfExists = async (labelName, issue_number) => {
    try {
        await _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit */ .A.issues.removeLabel({
            name: labelName,
            issue_number,
            ..._actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo
        });
    }
    catch (error) {
        if (error.status === 404) {
            _actions_core__WEBPACK_IMPORTED_MODULE_0__.info('Label is not present on PR.');
        }
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

//# sourceMappingURL=960.index.js.map