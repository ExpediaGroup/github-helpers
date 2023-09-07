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
import { getDestinationColumn, getProjectColumns } from '../utils/get-project-columns';
import { GITHUB_OPTIONS } from '../constants';
import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import { octokit } from '../octokit';
export class CreateProjectCardProps extends HelperInputs {
    constructor() {
        super(...arguments);
        this.project_name = '';
        this.project_destination_column_name = '';
    }
}
export const createProjectCard = ({ project_name, project_destination_column_name, note }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const columnsList = yield getProjectColumns({ project_name });
    if (!((_a = columnsList === null || columnsList === void 0 ? void 0 : columnsList.data) === null || _a === void 0 ? void 0 : _a.length)) {
        core.error(`There are no columns associated to ${project_name} project.`);
        return;
    }
    const destinationColumn = getDestinationColumn(columnsList, project_destination_column_name);
    if (!destinationColumn) {
        core.info('No destination column was found');
        return;
    }
    const cardParams = yield generateCardParams(destinationColumn, note);
    return octokit.projects.createCard(cardParams);
});
const generateCardParams = (filteredColumn, note) => __awaiter(void 0, void 0, void 0, function* () {
    const getResponse = yield octokit.pulls.get(Object.assign({ pull_number: context.issue.number }, context.repo));
    const pullRequest = getResponse.data;
    if (note) {
        return Object.assign(Object.assign({ column_id: filteredColumn === null || filteredColumn === void 0 ? void 0 : filteredColumn.id, note }, context.repo), GITHUB_OPTIONS);
    }
    return Object.assign(Object.assign({ column_id: filteredColumn.id, content_id: pullRequest.id, content_type: 'PullRequest', note }, context.repo), GITHUB_OPTIONS);
});
//# sourceMappingURL=create-project-card.js.map