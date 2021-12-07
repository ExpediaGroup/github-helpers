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

import { octokit } from '../octokit';
import * as core from '@actions/core';
import { context } from '@actions/github';
import { PullRequest, PullRequestGetResponse, ProjectListResponse, ColumnListResponse, CardListResponse } from '../types';
import { getProjectName } from '../utils/get-project-name';

interface MoveProjectCardProps {
  originColumn: string;
  destinationColumn: string;
  pull_number: number;
}

export const moveProjectCard = async ({ pull_number, destinationColumn, originColumn }: MoveProjectCardProps) => {
  const repositoryName = context.repo.repo;
  const projectName = getProjectName({ repo: repositoryName });
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
            if (project) {
              octokit.projects
                .listColumns({
                  project_id: project.id,
                  per_page: 100
                })
                .then(response => {
                  const coreReviewColumn = filterDestinationColumn(response, destinationColumn);
                  const filteredColumn = getOriginColumn(response, originColumn);
                  if (filteredColumn) {
                    octokit.projects
                      .listCards({
                        column_id: filteredColumn.id
                      })
                      .then(cards => {
                        const cardToMove = getCardToMove(cards, pullRequest.issue_url);
                        if (cardToMove && coreReviewColumn) {
                          octokit.projects.moveCard({
                            card_id: cardToMove.id,
                            column_id: coreReviewColumn.id,
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

const findProjectToModify = (projectsResponse: ProjectListResponse, projectName: string) =>
  projectsResponse.data.find(project => project.name === projectName);

const filterDestinationColumn = (columns: ColumnListResponse, destinationColumn: string) =>
  columns.data.find(column => column.name === destinationColumn);

const getOriginColumn = (columns: ColumnListResponse, originColumn: string) => columns.data.find(column => column.name === originColumn);

const getCardToMove = (cardsResponse: CardListResponse, issueUrl: string) => cardsResponse.data.find(card => card.content_url === issueUrl);
