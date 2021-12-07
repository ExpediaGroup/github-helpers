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
import { ColumnListResponse, ProjectListResponse, PullRequest, PullRequestGetResponse } from '../types';
import { WAITING_FOR_PEER_APPROVAL } from '../constants';
import { addProjectCard } from './add-project-card';
import { context } from '@actions/github';
import { getProjectName } from '../utils/get-project-name';
import { octokit } from '../octokit';

// import { addLabels } from './add-labels';

interface CreateProjectCardProps {
  teams?: string;
  pull_number: number;
  login?: string;
  project_name?: string;
}

export const createProjectCard = async ({ pull_number, project_name }: CreateProjectCardProps) => {
  console.log('project name: ', project_name);
  const repositoryName = context.repo.repo;
  const projectName = getProjectName({ repo: repositoryName });
  console.log('si entre');
  const destinationColumn = WAITING_FOR_PEER_APPROVAL;
  return octokit.pulls
    .get({
      pull_number,
      ...context.repo
    })
    .then((getResponse: PullRequestGetResponse) => {
      const pullRequest = getResponse.data as PullRequest;
      if (pullRequest) {
        octokit.projects
          .listForRepo({
            state: 'open',
            per_page: 100,
            ...context.repo
          })
          .then(projects => {
            const project = findProjectToModify(projects, projectName);
            console.log('project');
            if (project) {
              octokit.projects
                .listColumns({
                  project_id: project.id,
                  per_page: 100
                })
                .then(response => {
                  const filteredColumn = filterDestinationColumn(response, destinationColumn);
                  if (filteredColumn) {
                    return addProjectCard({
                      column_id: filteredColumn.id,
                      content_id: pullRequest.id,
                      content_type: 'PullRequest'
                    }).then(response => {
                      // move the card to the coulmn's bottom after created
                      octokit.projects.moveCard({
                        card_id: response.data.id,
                        position: 'bottom',
                        column_id: filteredColumn.id
                      });
                      // .then(() => {
                      //   return addLabels({
                      //     labels: QUEUED_FOR_REVIEW,
                      //     pull_number: String(pullRequest.number)
                      //   });
                      // });
                    });
                  }
                });
            }
          });
      }
    })
    .catch(error => {
      if (error.status === 409) {
        core.info('There was an error creating the project card.');
      }
    });
};

const findProjectToModify = (projectsResponse: ProjectListResponse, projectName: string) =>
  projectsResponse.data.find(project => project.name === projectName);

const filterDestinationColumn = (columns: ColumnListResponse, destinationColumn: string) =>
  columns.data.find(column => column.name === destinationColumn);
