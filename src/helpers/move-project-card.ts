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
import { CardListResponse, ColumnListResponse, ProjectListResponse, PullRequest, PullRequestGetResponse } from '../types';
import { context } from '@actions/github';
import { octokit } from '../octokit';

interface MoveProjectCardProps {
  project_destination_column_name: string;
  pull_number: number;
  project_name: string;
  project_origin_column_name: string;
}

export const moveProjectCard = async ({
  pull_number,
  project_destination_column_name,
  project_origin_column_name,
  project_name
}: MoveProjectCardProps) => {
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
            const project = findProjectToModify(projects, project_name);
            if (project) {
              octokit.projects
                .listColumns({
                  project_id: project.id,
                  per_page: 100
                })
                .then(response => {
                  const destinationColumn = filterDestinationColumn(response, project_destination_column_name);
                  const filteredColumn = getOriginColumn(response, project_origin_column_name);
                  if (filteredColumn) {
                    octokit.projects
                      .listCards({
                        column_id: filteredColumn.id
                      })
                      .then(cards => {
                        const cardToMove = getCardToMove(cards, pullRequest.issue_url);
                        if (cardToMove && destinationColumn) {
                          octokit.projects.moveCard({
                            card_id: cardToMove.id,
                            column_id: destinationColumn.id,
                            position: 'top'
                          });
                        }
                      });
                  }
                });
            }
          });
      }
    })
    .catch(error => {
      if (error.status === 409) {
        core.info('There was an error moving the project card.');
      }
    });
};

const findProjectToModify = (projectsResponse: ProjectListResponse, project_name: string) =>
  projectsResponse.data.find(project => project.name === project_name);

const filterDestinationColumn = (columns: ColumnListResponse, project_destination_column_name: string) =>
  columns.data.find(column => column.name === project_destination_column_name);

const getOriginColumn = (columns: ColumnListResponse, project_origin_column_name: string) =>
  columns.data.find(column => column.name === project_origin_column_name);

const getCardToMove = (cardsResponse: CardListResponse, issueUrl: string) => cardsResponse.data.find(card => card.content_url === issueUrl);
