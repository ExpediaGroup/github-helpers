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

import { getDestinationColumn, getProjectColumns } from '../utils/get-project-columns';
import { PullRequest } from '../types';
import { context } from '@actions/github';
import { octokit } from '../octokit';

interface CreateProjectCardProps {
  teams?: string;
  pull_number: number;
  login?: string;
  project_name: string;
  project_destination_column_name: string;
  note?: string;
}

export const createProjectCard = async ({ pull_number, project_name, project_destination_column_name, note }: CreateProjectCardProps) => {
  const getResponse = await octokit.pulls.get({ pull_number, ...context.repo });
  const pullRequest = getResponse.data as PullRequest;
  const columnsList = await getProjectColumns({ project_name });

  if (!columnsList) {
    return null;
  }

  const destinationColumn = getDestinationColumn(columnsList, project_destination_column_name);
  const cardParams = generateCardParams(note, destinationColumn, pullRequest);
  if (destinationColumn) {
    return octokit.projects.createCard(cardParams);
  }
};

const generateCardParams = (note: string | undefined, filteredColumn: any, pullRequest: PullRequest) => {
  if (note) {
    return {
      column_id: filteredColumn?.id,
      note,
      ...context.repo
    };
  }

  return {
    column_id: filteredColumn?.id,
    content_id: pullRequest.id,
    content_type: 'PullRequest',
    note,
    ...context.repo
  };
};
