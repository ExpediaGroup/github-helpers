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
import * as core from '@actions/core';
import { loadOwners, matchFile } from 'codeowners-utils';
import { uniq, union } from 'lodash';
import { context } from '@actions/github';
import { getChangedFilepaths } from './get-changed-filepaths';
import { map } from 'bluebird';
import { octokit } from '../octokit';
export const getCoreMemberLogins = (pull_number, teams) => __awaiter(void 0, void 0, void 0, function* () {
    const teamsAndLogins = yield getCoreTeamsAndLogins(pull_number, teams);
    return uniq(teamsAndLogins.map(({ login }) => login));
});
export const getCoreTeamsAndLogins = (pull_number, teams) => __awaiter(void 0, void 0, void 0, function* () {
    const codeOwners = teams !== null && teams !== void 0 ? teams : (yield getCodeOwners(pull_number));
    if (!(codeOwners === null || codeOwners === void 0 ? void 0 : codeOwners.length)) {
        core.setFailed('No code owners found. Please provide a "teams" input or set up a CODEOWNERS file in your repo.');
        throw new Error();
    }
    const teamsAndLogins = yield map(codeOwners, (team) => __awaiter(void 0, void 0, void 0, function* () {
        return octokit.teams
            .listMembersInOrg({
            org: context.repo.owner,
            team_slug: team,
            per_page: 100
        })
            .then(listMembersResponse => listMembersResponse.data.map(({ login }) => ({ team, login })));
    }));
    return union(...teamsAndLogins);
});
const getCodeOwners = (pull_number) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const codeOwners = (_a = (yield loadOwners(process.cwd()))) !== null && _a !== void 0 ? _a : [];
    const changedFilePaths = yield getChangedFilepaths(pull_number);
    const matchingCodeOwners = changedFilePaths.map(filePath => { var _a; return (_a = matchFile(filePath, codeOwners)) !== null && _a !== void 0 ? _a : {}; });
    return uniq(matchingCodeOwners
        .map(owner => owner.owners)
        .flat()
        .filter(Boolean)
        .map(owner => owner.substring(owner.indexOf('/') + 1)));
});
//# sourceMappingURL=get-core-member-logins.js.map