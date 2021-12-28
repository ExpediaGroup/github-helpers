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

import * as core from '@actions/core';
import { getDestinationColumn, getProjectColumns } from '../utils/get-project-columns';
import { ColumnListResponse } from '../types';
import { GITHUB_OPTIONS } from '../constants';
import { context } from '@actions/github';
import { octokit } from '../octokit';

interface MoveProjectCardProps {
  project_destination_column_name: string;
  project_name: string;
  project_origin_column_name: string;
}

export const moveProjectCard = async ({
  project_destination_column_name,
  project_origin_column_name,
  project_name
}: MoveProjectCardProps) => {
  const columnsList = await getProjectColumns({ project_name });

  if (!columnsList?.data?.length) {
    core.error(`There are no columns associated to ${project_name} project.`);
    return;
  }

  const destinationColumn = getDestinationColumn(columnsList, project_destination_column_name);
  const originColumn = getOriginColumn(columnsList, project_origin_column_name);

  if (!originColumn) {
    core.info(`No origin column was found for the name ${project_origin_column_name}`);
    return;
  }

  const cardToMove = await getCardToMove(originColumn);

  if (cardToMove && destinationColumn) {
    return octokit.projects.moveCard({ card_id: cardToMove.id, column_id: destinationColumn.id, position: 'top', ...GITHUB_OPTIONS });
  } else {
    core.info('No destination column or card to move was found');
    return;
  }
};

const getCardToMove = async (originColumn: OriginColumn) => {
  const getResponse = await octokit.pulls.get({ pull_number: context.issue.number, ...context.repo });
  const pullRequest = getResponse.data;
  const cardsResponse = await octokit.projects.listCards({ column_id: originColumn.id, ...GITHUB_OPTIONS });

  return cardsResponse.data.find(card => card.content_url === pullRequest.issue_url);
};

interface OriginColumn {
  id: number;
}

const getOriginColumn = (columns: ColumnListResponse, project_origin_column_name: string) =>
  columns.data.find(column => column.name === project_origin_column_name);
