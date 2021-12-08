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

import { ColumnListResponse, ProjectListResponse } from '../types';
import { context } from '@actions/github';
import { octokit } from '../octokit';

interface GetProjectColumns {
  project_name: string;
}

export const getProjectColumns = async ({ project_name }: GetProjectColumns) => {
  const projectList = await octokit.projects.listForRepo({ state: 'open', per_page: 100, ...context.repo });
  const project = findProjectToModify(projectList, project_name);

  if (!project) {
    return null;
  }

  return octokit.projects.listColumns({ project_id: project.id, per_page: 100 });
};

const findProjectToModify = (projectsResponse: ProjectListResponse, project_name: string) =>
  projectsResponse.data.find(project => project.name === project_name);

export const getDestinationColumn = (columns: ColumnListResponse, project_destination_column_name: string) =>
  columns.data.find(column => column.name === project_destination_column_name);

export const getOriginColumn = (columns: ColumnListResponse, project_origin_column_name: string) =>
  columns.data.find(column => column.name === project_origin_column_name);
