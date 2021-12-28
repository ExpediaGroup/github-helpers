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

import { GITHUB_OPTIONS } from '../../src/constants';
import { Mocktokit } from '../types';
import { moveProjectCard } from '../../src/helpers/move-project-card';
import { octokit } from '../../src/octokit';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      projects: {
        listCards: jest.fn(),
        listForRepo: jest.fn(),
        listColumns: jest.fn(),
        moveCard: jest.fn()
      },
      pulls: { get: jest.fn() }
    }
  }))
}));

describe('moveProjectCard', () => {
  const project_name = 'test project';
  const project_destination_column_name = 'test column 2';
  const project_origin_column_name = 'test column 1';

  beforeEach(() => {
    (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
      data: {
        owner_url: 'example owner url',
        url: 'another mock url',
        html_url: 'one more url',
        columns_url: 'column url',
        id: 123,
        node_id: 'some id',
        name: 'Mock PullRequest',
        body: 'A big text explaining what this mock PR does'
      }
    }));
    (octokit.projects.listForRepo as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          owner_url: 'example owner url',
          url: 'another mock url',
          html_url: 'one more url',
          columns_url: 'column url',
          id: 123,
          node_id: 'some id',
          name: 'test project',
          body: 'A big text explaining what this mock PR does'
        }
      ]
    }));
    (octokit.projects.listColumns as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          url: 'a mock url',
          project_url: 'the project url',
          cards_url: 'a mock card_url',
          id: 12345,
          node_id: 'a node id',
          name: 'test column 1',
          created_at: '2021-12-16',
          updated_at: '2021-12-16'
        },
        {
          url: 'a mock url',
          project_url: 'the project url',
          cards_url: 'a mock card_url',
          id: 12345,
          node_id: 'a node id',
          name: 'test column 2',
          created_at: '2021-12-16',
          updated_at: '2021-12-16'
        }
      ]
    }));
    (octokit.projects.listCards as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          note: null,
          url: 'a mock url',
          project_url: 'the project url',
          cards_url: 'a mock card_url',
          id: 1234,
          node_id: 'a node id',
          created_at: '2021-12-16',
          updated_at: '2021-12-16'
        }
      ]
    }));
    moveProjectCard({
      project_name,
      project_destination_column_name,
      project_origin_column_name
    });
  });

  it('should call moveProjectCard with the proper arguments', () => {
    expect(octokit.projects.moveCard).toHaveBeenCalledWith({
      card_id: 1234,
      column_id: 12345,
      position: 'top',
      ...GITHUB_OPTIONS
    });

    expect(octokit.projects.moveCard).toHaveBeenCalledTimes(1);
  });
});
