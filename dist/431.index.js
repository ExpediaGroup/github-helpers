export const id = 431;
export const ids = [431,250];
export const modules = {

/***/ 5431:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CheckMergeSafety: () => (/* binding */ CheckMergeSafety),
/* harmony export */   checkMergeSafety: () => (/* binding */ checkMergeSafety)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(8428);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6474);
/* harmony import */ var simple_git__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9070);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1015);
/* harmony import */ var micromatch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8785);
/* harmony import */ var micromatch__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(micromatch__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils_paginate_open_pull_requests__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3332);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4366);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _set_commit_status__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9250);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(4116);
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









const git = (0,simple_git__WEBPACK_IMPORTED_MODULE_1__/* .simpleGit */ .Lp)();
const maxBranchNameLength = 50;
class CheckMergeSafety extends _types_generated__WEBPACK_IMPORTED_MODULE_8__/* .HelperInputs */ .m {
}
const checkMergeSafety = async (inputs) => {
    const isPrWorkflow = Boolean(_actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.issue.number);
    if (!isPrWorkflow) {
        return handlePushWorkflow(inputs);
    }
    const { data: pullRequest } = await _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit */ .A.pulls.get({ pull_number: _actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.issue.number, ..._actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo });
    const { state, message } = await setMergeSafetyStatus(pullRequest, inputs);
    if (state === 'failure') {
        _actions_core__WEBPACK_IMPORTED_MODULE_7__/* .setFailed */ .C1(message);
    }
};
const setMergeSafetyStatus = async (pullRequest, { context = 'Merge Safety', ...inputs }) => {
    const { state, message } = await getMergeSafetyStateAndMessage(pullRequest, inputs);
    const hasExistingFailureStatus = await checkForExistingFailureStatus(pullRequest, context);
    if (hasExistingFailureStatus && state === 'failure') {
        const { head: { ref, user: { login: username } } } = pullRequest;
        const truncatedRef = ref.length > maxBranchNameLength ? `${ref.substring(0, maxBranchNameLength)}...` : ref;
        const truncatedBranchName = `${username}:${truncatedRef}`;
        _actions_core__WEBPACK_IMPORTED_MODULE_7__/* .info */ .pq(`Found existing failure status for ${truncatedBranchName}, skipping setting new status`);
    }
    else {
        await (0,_set_commit_status__WEBPACK_IMPORTED_MODULE_6__.setCommitStatus)({
            sha: pullRequest.head.sha,
            state,
            context,
            description: message,
            ..._actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo
        });
    }
    return { state, message };
};
const handlePushWorkflow = async (inputs) => {
    const pullRequests = await (0,_utils_paginate_open_pull_requests__WEBPACK_IMPORTED_MODULE_4__/* .paginateAllOpenPullRequests */ .U)();
    const filteredPullRequests = pullRequests.filter(({ base, draft }) => !draft && base.ref === base.repo.default_branch);
    await (0,bluebird__WEBPACK_IMPORTED_MODULE_5__.map)(filteredPullRequests, pullRequest => setMergeSafetyStatus(pullRequest, inputs));
};
const checkForExistingFailureStatus = async (pullRequest, context) => {
    const { data } = await _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit */ .A.repos.getCombinedStatusForRef({
        ..._actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo,
        ref: pullRequest.head.sha
    });
    if (data.state === 'failure') {
        const existingContext = data.statuses.find(status => status.context === context);
        return Boolean(existingContext);
    }
    return false;
};
const fetchSha = async (repoUrl, sha) => {
    try {
        await git.fetch(repoUrl, sha, { '--depth': 1 });
        _actions_core__WEBPACK_IMPORTED_MODULE_7__/* .info */ .pq(`Fetched ${sha} from ${repoUrl}`);
    }
    catch (err) {
        _actions_core__WEBPACK_IMPORTED_MODULE_7__/* .info */ .pq(`Failed to fetch ${sha} from ${repoUrl}: ${err.message}`);
        throw new Error(`Failed to fetch ${sha} from ${repoUrl}: ${err.message}`);
    }
};
const getDiffUsingGitCommand = async (repoUrl, baseSha, headSha) => {
    // update local repo copy
    await fetchSha(repoUrl, baseSha);
    await fetchSha(repoUrl, headSha);
    try {
        const diff = await git.diff(['--name-only', baseSha, headSha]);
        return (diff ?? '').split('\n').filter(Boolean);
    }
    catch (err) {
        _actions_core__WEBPACK_IMPORTED_MODULE_7__/* .error */ .z3(`Failed to run local git diff for ${repoUrl}: ${err.message}`);
        throw new Error(`Failed to run local git diff for ${repoUrl}: ${err.message}`);
    }
};
const getDiff = async (compareBase, compareHead, basehead) => {
    let changedFileNames = [];
    try {
        const { data: { files: changedFiles } = {}, status } = await _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit */ .A.repos.compareCommitsWithBasehead({
            ..._actions_github__WEBPACK_IMPORTED_MODULE_0__/* .context */ ._.repo,
            basehead
        });
        if (status > 400) {
            throw { status };
        }
        changedFileNames = changedFiles?.map(file => file.filename) ?? [];
    }
    catch (err) {
        _actions_core__WEBPACK_IMPORTED_MODULE_7__/* .info */ .pq(`Failed to fetch diff: ${err.message} Status: ${err.status}`);
        // diff too large error
        if (err?.status === 406 || err?.message.includes('diff is taking too long to generate')) {
            _actions_core__WEBPACK_IMPORTED_MODULE_7__/* .info */ .pq(`Attempting to generate diff using local git command`);
            if (compareBase.repo?.html_url) {
                changedFileNames = await getDiffUsingGitCommand(compareBase.repo?.html_url, compareBase.sha, compareHead.sha);
            }
            else {
                _actions_core__WEBPACK_IMPORTED_MODULE_7__/* .error */ .z3(`Could not fetch repo url to run local git diff`);
                throw err;
            }
        }
        else {
            throw err;
        }
    }
    return changedFileNames;
};
const getMergeSafetyStateAndMessage = async (pullRequest, { paths, ignore_globs, override_filter_paths, override_filter_globs }) => {
    const { base: { repo: { default_branch, owner: { login: baseOwner } } }, head: { ref, user: { login: username } } } = pullRequest;
    const branchName = `${username}:${ref}`;
    const diffAgainstUserBranch = `${branchName}...${baseOwner}:${default_branch}`;
    let fileNamesWhichBranchIsBehindOn;
    try {
        fileNamesWhichBranchIsBehindOn = await getDiff(pullRequest.head, pullRequest.base, diffAgainstUserBranch);
    }
    catch (err) {
        const message = diffErrorMessage(diffAgainstUserBranch, err.message);
        _actions_core__WEBPACK_IMPORTED_MODULE_7__/* .error */ .z3(message);
        return { state: 'failure', message };
    }
    const truncatedRef = ref.length > maxBranchNameLength ? `${ref.substring(0, maxBranchNameLength)}...` : ref;
    const truncatedBranchName = `${username}:${truncatedRef}`;
    const globalFilesOutdatedOnBranch = override_filter_globs
        ? micromatch__WEBPACK_IMPORTED_MODULE_3___default()(fileNamesWhichBranchIsBehindOn, override_filter_globs.split(/[\n,]/))
        : override_filter_paths
            ? fileNamesWhichBranchIsBehindOn.filter(changedFile => override_filter_paths.split(/[\n,]/).includes(changedFile))
            : [];
    if (globalFilesOutdatedOnBranch.length) {
        _actions_core__WEBPACK_IMPORTED_MODULE_7__/* .error */ .z3(buildErrorMessage(globalFilesOutdatedOnBranch, 'global files', truncatedBranchName));
        return {
            state: 'failure',
            message: `This branch has one or more outdated global files. Please update with ${default_branch}.`
        };
    }
    const diffAgainstDefaultBranch = `${baseOwner}:${default_branch}...${branchName}`;
    let changedFileNames;
    try {
        changedFileNames = await getDiff(pullRequest.base, pullRequest.head, diffAgainstDefaultBranch);
    }
    catch (err) {
        const message = diffErrorMessage(diffAgainstDefaultBranch, err.message);
        _actions_core__WEBPACK_IMPORTED_MODULE_7__/* .error */ .z3(message);
        return { state: 'failure', message };
    }
    const changedFilesToIgnore = changedFileNames && ignore_globs ? micromatch__WEBPACK_IMPORTED_MODULE_3___default()(changedFileNames, ignore_globs.split(/[\n,]/)) : [];
    const filteredFileNames = changedFileNames?.filter(file => !changedFilesToIgnore.includes(file));
    const allProjectDirectories = paths?.split(/[\n,]/);
    const changedProjectsOutdatedOnBranch = allProjectDirectories?.filter(dir => fileNamesWhichBranchIsBehindOn.some(file => file.includes(dir)) && filteredFileNames?.some(file => file.includes(dir)));
    if (changedProjectsOutdatedOnBranch?.length) {
        _actions_core__WEBPACK_IMPORTED_MODULE_7__/* .error */ .z3(buildErrorMessage(changedProjectsOutdatedOnBranch, 'projects', truncatedBranchName));
        return {
            state: 'failure',
            message: `This branch has one or more outdated projects. Please update with ${default_branch}.`
        };
    }
    const safeMessage = buildSuccessMessage(truncatedBranchName);
    _actions_core__WEBPACK_IMPORTED_MODULE_7__/* .info */ .pq(safeMessage);
    return {
        state: 'success',
        message: safeMessage
    };
};
const buildErrorMessage = (paths, pathType, branchName) => `
The following ${pathType} are outdated on branch ${branchName}

${paths.map(path => `* ${path}`).join('\n')}
`;
const diffErrorMessage = (basehead, message = '') => `Failed to generate diff for ${basehead}. Please verify SHAs are valid and try again.${message ? `\nError: ${message}` : ''}`;
const buildSuccessMessage = (branchName) => `Branch ${branchName} is safe to merge!`;


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
        _actions_core__WEBPACK_IMPORTED_MODULE_0__/* .info */ .pq('hey there');
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

function logging(octokit) {
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

//# sourceMappingURL=431.index.js.map