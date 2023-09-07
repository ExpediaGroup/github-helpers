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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import micromatch from 'micromatch';
import { paginateAllOpenPullRequests } from '../utils/paginate-open-pull-requests';
import { map } from 'bluebird';
import { setCommitStatus } from './set-commit-status';
import * as core from '@actions/core';
export class CheckMergeSafety extends HelperInputs {
}
export const checkMergeSafety = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    const isPrWorkflow = Boolean(context.issue.number);
    if (!isPrWorkflow) {
        return handlePushWorkflow(inputs);
    }
    const { data: pullRequest } = yield octokit.pulls.get(Object.assign({ pull_number: context.issue.number }, context.repo));
    return setMergeSafetyStatus(pullRequest, inputs);
});
const setMergeSafetyStatus = (pullRequest, inputs) => __awaiter(void 0, void 0, void 0, function* () {
    const { state, message } = yield getMergeSafetyStateAndMessage(pullRequest, inputs);
    yield setCommitStatus(Object.assign({ sha: pullRequest.head.sha, state, context: 'Merge Safety', description: message }, context.repo));
});
const handlePushWorkflow = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    const pullRequests = yield paginateAllOpenPullRequests();
    const filteredPullRequests = pullRequests.filter(({ base, draft }) => !draft && base.ref === base.repo.default_branch);
    return map(filteredPullRequests, pullRequest => setMergeSafetyStatus(pullRequest, inputs));
});
const getMergeSafetyStateAndMessage = (pullRequest, { paths, override_filter_paths, override_filter_globs }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { base: { repo: { default_branch, owner: { login: baseOwner } } }, head: { ref, user: { login: username } } } = pullRequest;
    const branchName = `${username}:${ref}`;
    const { data: { files: filesWhichBranchIsBehindOn } } = yield octokit.repos.compareCommitsWithBasehead(Object.assign(Object.assign({}, context.repo), { basehead: `${branchName}...${baseOwner}:${default_branch}` }));
    const fileNamesWhichBranchIsBehindOn = (_a = filesWhichBranchIsBehindOn === null || filesWhichBranchIsBehindOn === void 0 ? void 0 : filesWhichBranchIsBehindOn.map(file => file.filename)) !== null && _a !== void 0 ? _a : [];
    const globalFilesOutdatedOnBranch = override_filter_globs
        ? micromatch(fileNamesWhichBranchIsBehindOn, override_filter_globs.split('\n'))
        : override_filter_paths
            ? fileNamesWhichBranchIsBehindOn.filter(changedFile => override_filter_paths.split(/[\n,]/).includes(changedFile))
            : [];
    if (globalFilesOutdatedOnBranch.length) {
        core.error(buildErrorMessage(globalFilesOutdatedOnBranch, 'global files', branchName));
        return {
            state: 'failure',
            message: `This branch has one or more outdated global files. Please update with ${default_branch}.`
        };
    }
    const { data: { files: changedFiles } } = yield octokit.repos.compareCommitsWithBasehead(Object.assign(Object.assign({}, context.repo), { basehead: `${baseOwner}:${default_branch}...${branchName}` }));
    const changedFileNames = changedFiles === null || changedFiles === void 0 ? void 0 : changedFiles.map(file => file.filename);
    const allProjectDirectories = paths === null || paths === void 0 ? void 0 : paths.split(/[\n,]/);
    const changedProjectsOutdatedOnBranch = allProjectDirectories === null || allProjectDirectories === void 0 ? void 0 : allProjectDirectories.filter(dir => fileNamesWhichBranchIsBehindOn.some(file => file.includes(dir)) && (changedFileNames === null || changedFileNames === void 0 ? void 0 : changedFileNames.some(file => file.includes(dir))));
    if (changedProjectsOutdatedOnBranch === null || changedProjectsOutdatedOnBranch === void 0 ? void 0 : changedProjectsOutdatedOnBranch.length) {
        core.error(buildErrorMessage(changedProjectsOutdatedOnBranch, 'projects', branchName));
        return {
            state: 'failure',
            message: `This branch has one or more outdated projects. Please update with ${default_branch}.`
        };
    }
    const safeMessage = buildSuccessMessage(branchName);
    core.info(safeMessage);
    return {
        state: 'success',
        message: safeMessage
    };
});
const buildErrorMessage = (paths, pathType, branchName) => `
The following ${pathType} are outdated on branch ${branchName}

${paths.map(path => `* ${path}`).join('\n')}
`;
const buildSuccessMessage = (branchName) => `Branch ${branchName} is safe to merge!`;
//# sourceMappingURL=check-merge-safety.js.map