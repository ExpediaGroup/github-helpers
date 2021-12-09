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
import { SingleColumn, getDestinationColumn, getProjectColumns } from '../utils/get-project-columns';
import { PullRequest } from '../types';
import { context } from '@actions/github';
import { octokit } from '../octokit';

interface CreateProjectCardProps {
  pull_number: number;
  project_name: string;
  project_destination_column_name: string;
  note?: string;
}

export const createProjectCard = async ({ pull_number, project_name, project_destination_column_name, note }: CreateProjectCardProps) => {
  const getResponse = await octokit.pulls.get({ pull_number, ...context.repo });
  const pullRequest = getResponse.data as PullRequest;
  const columnsList = await getProjectColumns({ project_name });

  if (!columnsList?.data?.length) {
    core.error(`There are no columns associated to ${project_name} project.`);
    return;
  }

  const destinationColumn = getDestinationColumn(columnsList, project_destination_column_name);

  if (!destinationColumn) {
    core.info('No destination column was found');
    return;
  }
  const cardParams = generateCardParams(pullRequest, destinationColumn, note);

  if (cardParams) {
    return octokit.projects.createCard(cardParams);
  }
};

const generateCardParams = (pullRequest: PullRequest, filteredColumn: SingleColumn, note?: string) => {
  if (note) {
    return {
      column_id: filteredColumn?.id,
      note,
      ...context.repo
    };
  }

  return {
    column_id: filteredColumn.id,
    content_id: pullRequest.id,
    content_type: 'PullRequest',
    note,
    ...context.repo
  };
};
