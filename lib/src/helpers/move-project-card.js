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
export class MoveProjectCardProps extends HelperInputs {
    constructor() {
        super(...arguments);
        this.project_destination_column_name = '';
        this.project_name = '';
        this.project_origin_column_name = '';
    }
}
export const moveProjectCard = ({ project_destination_column_name, project_origin_column_name, project_name }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const columnsList = yield getProjectColumns({ project_name });
    if (!((_a = columnsList === null || columnsList === void 0 ? void 0 : columnsList.data) === null || _a === void 0 ? void 0 : _a.length)) {
        core.error(`There are no columns associated to ${project_name} project.`);
        return;
    }
    const destinationColumn = getDestinationColumn(columnsList, project_destination_column_name);
    const originColumn = getOriginColumn(columnsList, project_origin_column_name);
    if (!originColumn) {
        core.info(`No origin column was found for the name ${project_origin_column_name}`);
        return;
    }
    const cardToMove = yield getCardToMove(originColumn);
    if (cardToMove && destinationColumn) {
        return octokit.projects.moveCard(Object.assign({ card_id: cardToMove.id, column_id: destinationColumn.id, position: 'top' }, GITHUB_OPTIONS));
    }
    else {
        core.info('No destination column or card to move was found');
        return;
    }
});
const getCardToMove = (originColumn) => __awaiter(void 0, void 0, void 0, function* () {
    const { data: { issue_url } } = yield octokit.pulls.get(Object.assign({ pull_number: context.issue.number }, context.repo));
    const cardsResponse = yield octokit.projects.listCards(Object.assign({ column_id: originColumn.id }, GITHUB_OPTIONS));
    return cardsResponse.data.find(card => card.content_url === issue_url);
});
const getOriginColumn = (columns, project_origin_column_name) => columns.data.find(column => column.name === project_origin_column_name);
//# sourceMappingURL=move-project-card.js.map