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

import { Mocktokit } from '../types';
import { octokit } from '../../src/octokit';
import { rerunPrWorkflows } from '../../src/helpers/rerun-pr-workflows';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'Cool-Test-Repo', owner: 'Cool-Owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {}
  }))
}));

(octokit.request('GET /repos/{owner}/{repo}/actions/{branch}') as unknown as Mocktokit).mockImplementation(async () => ({
  data: [{ workflow_runs: [{ run_id: 123 }] }]
}));

describe('rerunPrWorkflows', () => {
  beforeEach(() => {
    rerunPrWorkflows({ branch: 'test-branch' });
  });

  it('should make a successful GET request with the correct params', () => {
    expect(octokit.request).toHaveBeenCalledWith({
      owner: 'Expedia-UI',
      repo: 'Cool-Test-Repo',
      branch: 'test-branch'
    });
  });

  it('should make a successful POST request with the correct params', () => {
    expect(octokit.request).toHaveBeenCalledWith({
      owner: 'Expedia-UI',
      repo: 'Cool-Test-Repo',
      branch: 'test-branch',
      run_id: '123'
    });
  });
});
