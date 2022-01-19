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
import * as helperModule from '../src/helpers/create-pr-comment';
import { getActionInputs } from '../src/utils/get-action-inputs';
import { getInput } from '@actions/core';
import { run } from '../src/main';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({ rest: { issues: { createComment: jest.fn() } } }))
}));
jest.mock('../src/utils/get-action-inputs');
const helperSpy = jest.spyOn(helperModule, 'createPrComment');
const helper = 'create-pr-comment';
const otherInputs = {
  my: 'input',
  another: 'input'
};
const output = 'some output';
(getInput as jest.Mock).mockReturnValue(helper);
(getActionInputs as jest.Mock).mockReturnValue(otherInputs);
(helperSpy as jest.Mock).mockResolvedValue(output);

describe('main', () => {
  beforeEach(async () => {
    await run();
  });

  it('should call getActionInputs with correct params', () => {
    expect(getActionInputs).toHaveBeenCalledWith(['body']);
  });

  it('should call helper with all inputs', () => {
    expect(helperSpy).toHaveBeenCalledWith(otherInputs);
  });

  it('should set output', () => {
    expect(core.setOutput).toHaveBeenCalledWith('output', output);
  });
});
