export const id = 284;
export const ids = [284,59,280,862,783,598,250];
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

/***/ 8059:
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
// EXTERNAL MODULE: ./node_modules/@actions/github/lib/github.js + 20 modules
var github = __webpack_require__(6474);
// EXTERNAL MODULE: ./src/utils/get-core-member-logins.ts
var get_core_member_logins = __webpack_require__(5587);
// EXTERNAL MODULE: ./node_modules/bluebird/js/release/bluebird.js
var bluebird = __webpack_require__(4366);
// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js + 15 modules
var core = __webpack_require__(4116);
// EXTERNAL MODULE: ./src/octokit.ts + 1 modules
var octokit = __webpack_require__(1015);
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
        ...github/* context */._.repo
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
// EXTERNAL MODULE: ./src/utils/paginate-members-in-org.ts
var paginate_members_in_org = __webpack_require__(2275);
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
    const prNumber = pull_number ? Number(pull_number) : github/* context */._.issue.number;
    const teamOverrides = required_review_overrides?.split(',').map(overrideString => {
        const [team, numberOfRequiredReviews] = overrideString.split(':');
        return { team, numberOfRequiredReviews };
    });
    const teamsList = updateTeamsList(teams?.split('\n'));
    if (!validateTeamsList(teamsList)) {
        core/* setFailed */.C1('If teams input is in the format "org/team", then the org must be the same as the repository org');
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
                const members = await (0,paginate_members_in_org/* paginateMembersInOrg */.c)(teamOrUsers);
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
    core/* info */.pq(logs.join('\n'));
    return approvalsSatisfied;
};
const createArtificialCodeOwnersEntry = ({ teams = [], users = [] }) => [
    { owners: teams.concat(users) }
];
const isTeam = (teamOrUsers) => teamOrUsers.includes('/');
const updateTeamsList = (teamsList) => {
    return teamsList?.map(team => {
        if (!team.includes('/')) {
            return `${github/* context */._.repo.owner}/${team}`;
        }
        else {
            return team;
        }
    });
};
const validateTeamsList = (teamsList) => {
    return (teamsList?.every(team => {
        const inputOrg = team.split('/')[0];
        return inputOrg === github/* context */._.repo.owner;
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
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6474);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1015);
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
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.owner
        }))) ||
        emptyResponse;
    return prs.data.find(Boolean)?.number;
};
const getCommentByUser = async (login, pull_number, repo_name, repo_owner_name) => {
    const comments = (login &&
        (await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.issues.listComments({
            issue_number: pull_number ? Number(pull_number) : _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.issue.number,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.owner
        }))) ||
        emptyResponse;
    return comments.data.find(comment => comment?.user?.login === login)?.id;
};
const createPrComment = async ({ body, sha, login, pull_number, repo_name, repo_owner_name }) => {
    const defaultPrNumber = _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.issue.number;
    if (!sha && !login) {
        return _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.issues.createComment({
            body,
            issue_number: pull_number ? Number(pull_number) : defaultPrNumber,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.owner
        });
    }
    const prNumber = (await getFirstPrByCommit(sha, repo_name, repo_owner_name)) ?? (pull_number ? Number(pull_number) : defaultPrNumber);
    const commentId = await getCommentByUser(login, pull_number, repo_name, repo_owner_name);
    if (commentId) {
        return _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.issues.updateComment({
            comment_id: commentId,
            body,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.owner
        });
    }
    else {
        return _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.issues.createComment({
            body,
            issue_number: prNumber,
            repo: repo_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.repo,
            owner: repo_owner_name ?? _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.owner
        });
    }
};


/***/ }),

/***/ 4862:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetEmailOnUserProfile: () => (/* binding */ GetEmailOnUserProfile),
/* harmony export */   getEmailOnUserProfile: () => (/* binding */ getEmailOnUserProfile)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8428);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1015);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4116);
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



class GetEmailOnUserProfile extends _types_generated__WEBPACK_IMPORTED_MODULE_2__/* .HelperInputs */ .m {
    login = '';
}
const getEmailOnUserProfile = async ({ login, pattern }) => {
    const { data: { email } } = await _octokit__WEBPACK_IMPORTED_MODULE_0__/* .octokit */ .A.users.getByUsername({ username: login });
    if (!email) {
        (0,_actions_core__WEBPACK_IMPORTED_MODULE_1__/* .setFailed */ .C1)(`User ${login} does not have an email address on their GitHub profile!`);
        return;
    }
    if (pattern && !new RegExp(pattern).test(email)) {
        (0,_actions_core__WEBPACK_IMPORTED_MODULE_1__/* .setFailed */ .C1)(`Email ${email} does not match regex pattern ${pattern}. Please update the email on your GitHub profile to match this pattern!`);
        return;
    }
    return email;
};


/***/ }),

/***/ 8783:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IsUserInTeam: () => (/* binding */ IsUserInTeam),
/* harmony export */   isUserInTeam: () => (/* binding */ isUserInTeam)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6474);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1015);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4116);
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
const isUserInTeam = async ({ login = _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.actor, team }) => {
    const members = await paginateAllMembersInOrg(team);
    _actions_core__WEBPACK_IMPORTED_MODULE_2__/* .info */ .pq(`Checking if ${login} is in team ${team}`);
    _actions_core__WEBPACK_IMPORTED_MODULE_2__/* .info */ .pq(`Team members: ${members.map(({ login }) => login).join(', ')}`);
    return members.some(({ login: memberLogin }) => memberLogin === login);
};
async function paginateAllMembersInOrg(team, page = 1) {
    const response = await _octokit__WEBPACK_IMPORTED_MODULE_1__/* .octokit */ .A.teams.listMembersInOrg({
        org: _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo.owner,
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

/***/ 4703:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ManageMergeQueue: () => (/* binding */ ManageMergeQueue),
  enableAutoMerge: () => (/* binding */ enableAutoMerge),
  manageMergeQueue: () => (/* binding */ manageMergeQueue),
  removePrFromQueue: () => (/* binding */ removePrFromQueue)
});

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js + 15 modules
var core = __webpack_require__(4116);
// EXTERNAL MODULE: ./src/constants.ts
var constants = __webpack_require__(7242);
// EXTERNAL MODULE: ./src/types/generated.ts
var generated = __webpack_require__(8428);
// EXTERNAL MODULE: ./node_modules/@actions/github/lib/github.js + 20 modules
var github = __webpack_require__(6474);
// EXTERNAL MODULE: ./src/utils/notify-user.ts
var notify_user = __webpack_require__(9190);
// EXTERNAL MODULE: ./src/octokit.ts + 1 modules
var octokit = __webpack_require__(1015);
// EXTERNAL MODULE: ./src/helpers/remove-label.ts
var remove_label = __webpack_require__(5598);
// EXTERNAL MODULE: ./src/helpers/set-commit-status.ts
var set_commit_status = __webpack_require__(9250);
// EXTERNAL MODULE: ./node_modules/bluebird/js/release/bluebird.js
var bluebird = __webpack_require__(4366);
// EXTERNAL MODULE: ./src/helpers/prepare-queued-pr-for-merge.ts
var prepare_queued_pr_for_merge = __webpack_require__(6546);
;// CONCATENATED MODULE: ./src/utils/update-merge-queue.ts
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







const updateMergeQueue = (queuedPrs) => {
    const sortedPrs = sortPrsByQueuePosition(queuedPrs);
    return (0,bluebird.map)(sortedPrs, updateQueuePosition);
};
const sortPrsByQueuePosition = (queuedPrs) => queuedPrs
    .map(pr => {
    const label = pr.labels.find(label => label.name?.startsWith(constants/* QUEUED_FOR_MERGE_PREFIX */.KE))?.name;
    const hasJumpTheQueueLabel = Boolean(pr.labels.find(label => label.name === constants/* JUMP_THE_QUEUE_PR_LABEL */.hU));
    const queuePosition = Number(label?.split('#')?.[1]);
    return {
        number: pr.number,
        label,
        hasJumpTheQueueLabel,
        queuePosition,
        sha: pr.head.sha
    };
})
    .sort((pr1, pr2) => {
    if (pr1.hasJumpTheQueueLabel) {
        return -1;
    }
    if (pr2.hasJumpTheQueueLabel) {
        return 1;
    }
    return pr1.queuePosition - pr2.queuePosition;
});
const updateQueuePosition = async (pr, index) => {
    const { number, label, queuePosition, sha, hasJumpTheQueueLabel } = pr;
    const newQueuePosition = index + 1;
    if (!label || isNaN(queuePosition) || queuePosition === newQueuePosition) {
        return;
    }
    if (hasJumpTheQueueLabel) {
        await (0,remove_label.removeLabelIfExists)(constants/* JUMP_THE_QUEUE_PR_LABEL */.hU, number);
    }
    const prIsNowFirstInQueue = newQueuePosition === 1;
    if (prIsNowFirstInQueue) {
        const { data: firstPrInQueue } = await octokit/* octokit */.A.pulls.get({ pull_number: number, ...github/* context */._.repo });
        await (0,prepare_queued_pr_for_merge.updatePrWithDefaultBranch)(firstPrInQueue);
        const { data: { head: { sha: updatedHeadSha } } } = await octokit/* octokit */.A.pulls.get({ pull_number: number, ...github/* context */._.repo });
        return Promise.all([
            octokit/* octokit */.A.issues.addLabels({
                labels: [`${constants/* QUEUED_FOR_MERGE_PREFIX */.KE} #${newQueuePosition}`],
                issue_number: number,
                ...github/* context */._.repo
            }),
            (0,remove_label.removeLabelIfExists)(label, number),
            (0,set_commit_status.setCommitStatus)({
                sha: updatedHeadSha,
                context: constants/* MERGE_QUEUE_STATUS */.Qw,
                state: 'success',
                description: 'This PR is next to merge.'
            })
        ]);
    }
    return Promise.all([
        octokit/* octokit */.A.issues.addLabels({
            labels: [`${constants/* QUEUED_FOR_MERGE_PREFIX */.KE} #${newQueuePosition}`],
            issue_number: number,
            ...github/* context */._.repo
        }),
        (0,remove_label.removeLabelIfExists)(label, number),
        (0,set_commit_status.setCommitStatus)({
            sha,
            context: constants/* MERGE_QUEUE_STATUS */.Qw,
            state: 'pending',
            description: 'This PR is in line to merge.'
        })
    ]);
};

// EXTERNAL MODULE: ./src/utils/paginate-open-pull-requests.ts
var paginate_open_pull_requests = __webpack_require__(3332);
// EXTERNAL MODULE: ./src/helpers/approvals-satisfied.ts + 1 modules
var approvals_satisfied = __webpack_require__(8059);
// EXTERNAL MODULE: ./src/helpers/create-pr-comment.ts
var create_pr_comment = __webpack_require__(9280);
// EXTERNAL MODULE: ./src/helpers/is-user-in-team.ts
var is_user_in_team = __webpack_require__(8783);
// EXTERNAL MODULE: ./src/helpers/get-email-on-user-profile.ts
var get_email_on_user_profile = __webpack_require__(4862);
;// CONCATENATED MODULE: ./src/helpers/manage-merge-queue.ts
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















class ManageMergeQueue extends generated/* HelperInputs */.m {
}
const manageMergeQueue = async ({ max_queue_size, login, slack_webhook_url, skip_auto_merge, team = '', allow_only_for_maintainers, pattern } = {}) => {
    const { data: pullRequest } = await octokit/* octokit */.A.pulls.get({ pull_number: github/* context */._.issue.number, ...github/* context */._.repo });
    if (pullRequest.merged || !pullRequest.labels.find(label => label.name === constants/* READY_FOR_MERGE_PR_LABEL */.ZV)) {
        core/* info */.pq('This PR is not in the merge queue.');
        return removePrFromQueue(pullRequest);
    }
    const prMeetsRequiredApprovals = await (0,approvals_satisfied.approvalsSatisfied)({
        body: 'PRs must meet all required approvals before entering the merge queue.'
    });
    if (!prMeetsRequiredApprovals) {
        return removePrFromQueue(pullRequest);
    }
    if (slack_webhook_url && login) {
        const email = await (0,get_email_on_user_profile.getEmailOnUserProfile)({ login, pattern });
        if (!email) {
            const patternText = pattern ? `, and it must match the regex pattern \`${pattern}\`` : '';
            await (0,create_pr_comment.createPrComment)({
                body: `@${login} Your PR cannot be added to the queue because your email must be set on your GitHub profile${patternText}. Follow the instructions [here](${githubEmailDocsLink}) to add or fix your email on ${github/* context */._.serverUrl}!`
            });
            return removePrFromQueue(pullRequest);
        }
    }
    const queuedPrs = await getQueuedPullRequests();
    const queuePosition = queuedPrs.length + 1;
    const prAttemptingToJoinQueue = pullRequest.labels.every(label => !label.name?.startsWith(constants/* QUEUED_FOR_MERGE_PREFIX */.KE));
    if (prAttemptingToJoinQueue && queuePosition > Number(max_queue_size)) {
        await (0,create_pr_comment.createPrComment)({
            body: `The merge queue is full! Only ${max_queue_size} PRs are allowed in the queue at a time.\n\nIf you would like to merge your PR, please monitor the PRs in the queue and make sure the authors are around to merge them.`
        });
        return removePrFromQueue(pullRequest);
    }
    if (pullRequest.labels.find(label => label.name === constants/* JUMP_THE_QUEUE_PR_LABEL */.hU)) {
        if (allow_only_for_maintainers === 'true') {
            core/* info */.pq(`Checking if user ${login} is a maintainer...`);
            const isMaintainer = await (0,is_user_in_team.isUserInTeam)({ login: github/* context */._.actor, team: team });
            if (!isMaintainer) {
                await (0,remove_label.removeLabelIfExists)(constants/* JUMP_THE_QUEUE_PR_LABEL */.hU, pullRequest.number);
                return await (0,create_pr_comment.createPrComment)({
                    body: `@${github/* context */._.actor} Only core maintainers can jump the queue. Please have a core maintainer jump the queue for you.`
                });
            }
        }
        return updateMergeQueue(queuedPrs);
    }
    if (prAttemptingToJoinQueue) {
        await addPrToQueue(pullRequest, queuePosition, skip_auto_merge);
    }
    const isFirstQueuePosition = queuePosition === 1 || pullRequest.labels.find(label => label.name === constants/* FIRST_QUEUED_PR_LABEL */.RB);
    if (isFirstQueuePosition) {
        await (0,prepare_queued_pr_for_merge.updatePrWithDefaultBranch)(pullRequest);
    }
    await (0,set_commit_status.setCommitStatus)({
        sha: pullRequest.head.sha,
        context: constants/* MERGE_QUEUE_STATUS */.Qw,
        state: isFirstQueuePosition ? 'success' : 'pending',
        description: isFirstQueuePosition ? 'This PR is next to merge.' : 'This PR is in line to merge.'
    });
    if (isFirstQueuePosition && slack_webhook_url && login) {
        await (0,notify_user/* notifyUser */.l)({
            login,
            pull_number: github/* context */._.issue.number,
            slack_webhook_url
        });
    }
};
const removePrFromQueue = async (pullRequest) => {
    await (0,remove_label.removeLabelIfExists)(constants/* READY_FOR_MERGE_PR_LABEL */.ZV, pullRequest.number);
    const queueLabel = pullRequest.labels.find(label => label.name?.startsWith(constants/* QUEUED_FOR_MERGE_PREFIX */.KE))?.name;
    if (queueLabel) {
        await (0,remove_label.removeLabelIfExists)(queueLabel, pullRequest.number);
    }
    await (0,set_commit_status.setCommitStatus)({
        sha: pullRequest.head.sha,
        context: constants/* MERGE_QUEUE_STATUS */.Qw,
        state: 'pending',
        description: 'This PR is not in the merge queue.'
    });
    const queuedPrs = await getQueuedPullRequests();
    return updateMergeQueue(queuedPrs);
};
const addPrToQueue = async (pullRequest, queuePosition, skip_auto_merge) => {
    await octokit/* octokit */.A.issues.addLabels({
        labels: [`${constants/* QUEUED_FOR_MERGE_PREFIX */.KE} #${queuePosition}`],
        issue_number: github/* context */._.issue.number,
        ...github/* context */._.repo
    });
    if (skip_auto_merge == 'true') {
        core/* info */.pq('Skipping auto merge per configuration.');
        return;
    }
    await enableAutoMerge(pullRequest.node_id);
};
const getQueuedPullRequests = async () => {
    const openPullRequests = await (0,paginate_open_pull_requests/* paginateAllOpenPullRequests */.U)();
    return openPullRequests.filter(pr => pr.labels.some(label => label.name === constants/* READY_FOR_MERGE_PR_LABEL */.ZV) &&
        pr.labels.some(label => label.name.startsWith(constants/* QUEUED_FOR_MERGE_PREFIX */.KE)));
};
const enableAutoMerge = async (pullRequestId, mergeMethod = 'SQUASH') => {
    try {
        await (0,octokit/* octokitGraphql */.n)(`
    mutation {
      enablePullRequestAutoMerge(input: { pullRequestId: "${pullRequestId}", mergeMethod: ${mergeMethod} }) {
        clientMutationId
      }
    }
  `);
    }
    catch (error) {
        core/* warning */.$e('Auto merge could not be enabled. Perhaps you need to enable auto-merge on your repo?');
        core/* warning */.$e(error);
    }
};
const githubEmailDocsLink = 'https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/changing-your-primary-email-address';


/***/ }),

/***/ 6546:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prepareQueuedPrForMerge: () => (/* binding */ prepareQueuedPrForMerge),
/* harmony export */   updatePrWithDefaultBranch: () => (/* binding */ updatePrWithDefaultBranch)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4116);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7242);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6474);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1015);
/* harmony import */ var _manage_merge_queue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4703);
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





const prepareQueuedPrForMerge = async () => {
    const { data } = await _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.pulls.list({
        state: 'open',
        per_page: 100,
        ..._actions_github__WEBPACK_IMPORTED_MODULE_2__/* .context */ ._.repo
    });
    const pullRequest = findNextPrToMerge(data);
    if (pullRequest) {
        return updatePrWithDefaultBranch(pullRequest);
    }
};
const findNextPrToMerge = (pullRequests) => pullRequests.find(pr => hasRequiredLabels(pr, [_constants__WEBPACK_IMPORTED_MODULE_1__/* .READY_FOR_MERGE_PR_LABEL */ .ZV, _constants__WEBPACK_IMPORTED_MODULE_1__/* .JUMP_THE_QUEUE_PR_LABEL */ .hU])) ??
    pullRequests.find(pr => hasRequiredLabels(pr, [_constants__WEBPACK_IMPORTED_MODULE_1__/* .READY_FOR_MERGE_PR_LABEL */ .ZV, _constants__WEBPACK_IMPORTED_MODULE_1__/* .FIRST_QUEUED_PR_LABEL */ .RB]));
const hasRequiredLabels = (pr, requiredLabels) => requiredLabels.every(mergeQueueLabel => pr.labels.some(label => label.name === mergeQueueLabel));
const updatePrWithDefaultBranch = async (pullRequest) => {
    if (pullRequest.head.user?.login && pullRequest.base.user?.login && pullRequest.head.user?.login !== pullRequest.base.user?.login) {
        try {
            // update fork default branch with upstream
            await _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.repos.mergeUpstream({
                ..._actions_github__WEBPACK_IMPORTED_MODULE_2__/* .context */ ._.repo,
                branch: pullRequest.base.repo.default_branch
            });
        }
        catch (error) {
            if (error.status === 409) {
                _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .setFailed */ .C1('Attempt to update fork branch with upstream failed; conflict on default branch between fork and upstream.');
            }
            else
                _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .setFailed */ .C1(error.message);
        }
    }
    try {
        await _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.repos.merge({
            base: pullRequest.head.ref,
            head: 'HEAD',
            ..._actions_github__WEBPACK_IMPORTED_MODULE_2__/* .context */ ._.repo
        });
    }
    catch (error) {
        const noEvictUponConflict = _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .getInput */ .V4('no_evict_upon_conflict');
        const githubError = error;
        if (githubError.status !== 409) {
            _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .setFailed */ .C1(githubError.message);
            return;
        }
        if (noEvictUponConflict === 'true') {
            _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .info */ .pq('The first PR in the queue has a merge conflict. PR was not removed from the queue due to no_evict_upon_conflict input.');
            return;
        }
        await (0,_manage_merge_queue__WEBPACK_IMPORTED_MODULE_4__.removePrFromQueue)(pullRequest);
        _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .setFailed */ .C1('The first PR in the queue has a merge conflict, and it was removed from the queue.');
    }
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
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6474);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1015);
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

/***/ 9250:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SetCommitStatus: () => (/* binding */ SetCommitStatus),
/* harmony export */   setCommitStatus: () => (/* binding */ setCommitStatus)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4116);
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6474);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4366);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1015);
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





class SetCommitStatus extends _types_generated__WEBPACK_IMPORTED_MODULE_4__/* .HelperInputs */ .m {
    sha = '';
    context = '';
    state = '';
}
const setCommitStatus = async ({ sha, context, state, description, target_url, skip_if_already_set }) => {
    await (0,bluebird__WEBPACK_IMPORTED_MODULE_2__.map)(context.split('\n').filter(Boolean), async (context) => {
        if (skip_if_already_set === 'true') {
            const check_runs = await _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.checks.listForRef({
                ..._actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo,
                ref: sha
            });
            const run = check_runs.data.check_runs.find(({ name }) => name === context);
            const runCompletedAndIsValid = run?.status === 'completed' && (run?.conclusion === 'failure' || run?.conclusion === 'success');
            if (runCompletedAndIsValid) {
                _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .info */ .pq(`${context} already completed with a ${run.conclusion} conclusion.`);
                return;
            }
        }
        await _octokit__WEBPACK_IMPORTED_MODULE_3__/* .octokit */ .A.repos.createCommitStatus({
            sha,
            context,
            state: state,
            description,
            target_url,
            ..._actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo
        });
    });
};


/***/ }),

/***/ 1015:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ octokit),
  n: () => (/* binding */ octokitGraphql)
});

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js + 15 modules
var core = __webpack_require__(4116);
// EXTERNAL MODULE: ./node_modules/@adobe/node-fetch-retry/index.js
var node_fetch_retry = __webpack_require__(1806);
// EXTERNAL MODULE: ./node_modules/@actions/github/lib/github.js + 20 modules
var github = __webpack_require__(6474);
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

const logging = (octokit) => {
    core/* info */.pq('Logging plugin initialized');
    octokit.hook.wrap('request', async (request, options) => {
        const endpoint = `${options.method} ${options.url}`;
        core/* info */.pq(`GitHub API call: ${endpoint}`);
        try {
            return await request(options);
        }
        catch (error) {
            core/* error */.z3(`GitHub API Error: ${endpoint}`);
            core/* error */.z3(`Message: ${error.message}`);
            if (error && typeof error === 'object' && 'status' in error) {
                core/* error */.z3(`Status: ${error.status}`);
            }
            if (error && typeof error === 'object' && 'response' in error) {
                const requestError = error;
                if (requestError.response?.data) {
                    core/* error */.z3(`Response: ${JSON.stringify(requestError.response.data, null, 2)}`);
                }
            }
            throw error;
        }
    });
    return {};
};

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
const { rest: octokit, graphql: octokitGraphql } = (0,github/* getOctokit */.Q)(githubToken, {
    request: { fetch: node_fetch_retry },
    plugins: [logging]
});


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
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6474);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1015);
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
        ..._actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo
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
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4116);
/* harmony import */ var codeowners_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9409);
/* harmony import */ var codeowners_utils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(codeowners_utils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2356);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _get_changed_filepaths__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6039);
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
                _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .setFailed */ .C1('Invalid code_owners_override format. Please provide a comma-separated list of lines in GitHub CODEOWNERS format. For example, "/foo @owner1 @owner2,/bar @owner3".');
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
        _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .setFailed */ .C1('No code owners found. Please provide a "teams" input or set up a CODEOWNERS file in your repo.');
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

/***/ 9190:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   l: () => (/* binding */ notifyUser)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4116);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7568);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6474);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1015);
/* harmony import */ var _helpers_get_email_on_user_profile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4862);
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





const notifyUser = async ({ login, pull_number, slack_webhook_url }) => {
    const email = await (0,_helpers_get_email_on_user_profile__WEBPACK_IMPORTED_MODULE_3__.getEmailOnUserProfile)({ login });
    if (!email) {
        return;
    }
    const { data: { title, html_url } } = await _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit */ .A.pulls.get({ pull_number, ..._actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo });
    if (!title || !html_url) {
        return;
    }
    _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .info */ .pq(`Notifying user ${login}...`);
    const result = await axios__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.post(slack_webhook_url, {
        assignee: email,
        title,
        html_url,
        repo: _actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo.repo
    });
    if (result.status !== 200) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .error */ .z3(result.statusText);
        _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .setFailed */ .C1(`User notification failed for login: ${login} and email: ${email}`);
    }
    return result;
};


/***/ }),

/***/ 2275:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ paginateMembersInOrg)
/* harmony export */ });
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1015);
/* harmony import */ var _convert_to_team_slug__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6668);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6474);
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
        org: _actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo.owner,
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


/***/ }),

/***/ 3332:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   U: () => (/* binding */ paginateAllOpenPullRequests)
/* harmony export */ });
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1015);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6474);
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


const paginateAllOpenPullRequests = async (page = 1) => {
    const response = await _octokit__WEBPACK_IMPORTED_MODULE_0__/* .octokit */ .A.pulls.list({
        state: 'open',
        sort: 'updated',
        direction: 'desc',
        per_page: 100,
        page,
        ..._actions_github__WEBPACK_IMPORTED_MODULE_1__/* .context */ ._.repo
    });
    if (!response.data.length) {
        return [];
    }
    return response.data.concat(await paginateAllOpenPullRequests(page + 1));
};


/***/ })

};

//# sourceMappingURL=284.index.js.map