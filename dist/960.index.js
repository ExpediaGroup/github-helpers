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
// EXTERNAL MODULE: ./src/octokit.ts + 1 modules
var octokit = __webpack_require__(3396);
// EXTERNAL MODULE: ./node_modules/@actions/github/lib/github.js + 4 modules
var github = __webpack_require__(4387);
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
        ...github/* context */._.repo
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
        ...github/* context */._.repo
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
            ...github/* context */._.repo
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
                ...github/* context */._.repo
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
                ...github/* context */._.repo
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
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4116);
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4387);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3396);
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
const removeLabel = async ({ label }) => removeLabelIfExists(label, _actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.issue.number);
const removeLabelIfExists = async (labelName, issue_number) => {
    try {
        await _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit */ .A.issues.removeLabel({
            name: labelName,
            issue_number,
            ..._actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo
        });
    }
    catch (error) {
        if (error.status === 404) {
            _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .info */ .pq('Label is not present on PR.');
        }
    }
};


/***/ }),

/***/ 3396:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ octokit),
  n: () => (/* binding */ octokitGraphql)
});

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js + 15 modules
var core = __webpack_require__(4116);
// EXTERNAL MODULE: ./node_modules/@octokit/core/dist-src/index.js + 10 modules
var dist_src = __webpack_require__(708);
// EXTERNAL MODULE: ./node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/index.js + 3 modules
var plugin_rest_endpoint_methods_dist_src = __webpack_require__(9210);
// EXTERNAL MODULE: ./node_modules/@octokit/plugin-retry/dist-bundle/index.js
var dist_bundle = __webpack_require__(9735);
;// CONCATENATED MODULE: ./src/logging.ts
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

function logging(octokit) {
    octokit.hook.before('request', async (options) => {
        const endpoint = `${options.method} ${options.url}`;
        core/* info */.pq(`GitHub API call: ${endpoint}`);
    });
    octokit.hook.error('request', async (error, options) => {
        const endpoint = `${options.method} ${options.url}`;
        core/* error */.z3(`GitHub API Error: ${endpoint}`);
        core/* error */.z3(`Message: ${error.message}`);
        if ('status' in error && error.status) {
            core/* error */.z3(`Status: ${error.status}`);
        }
        if ('response' in error && error.response?.data) {
            core/* error */.z3(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        throw error;
    });
}

;// CONCATENATED MODULE: ./src/octokit.ts
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





const githubToken = core/* getInput */.V4('github_token', { required: true });
const baseUrl = process.env.GITHUB_API_URL || 'https://api.github.com';
const OctokitWithPlugins = dist_src/* Octokit */.E.plugin(plugin_rest_endpoint_methods_dist_src/* restEndpointMethods */._, dist_bundle/* retry */.L, logging);
const { rest: octokit, graphql: octokitGraphql } = new OctokitWithPlugins({ auth: githubToken, baseUrl });


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


/***/ })

};

//# sourceMappingURL=960.index.js.map