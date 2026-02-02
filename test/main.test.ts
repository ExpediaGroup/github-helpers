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

import { describe, it, expect, beforeEach, spyOn } from 'bun:test';
import { setupMocks } from './setup';

setupMocks();

const coreModule = await import('@actions/core');
const getActionInputsModule = await import('../src/utils/get-action-inputs');
const helperModule = await import('../src/helpers/create-pr-comment');

const getInputSpy = spyOn(coreModule, 'getInput');
const getActionInputsSpy = spyOn(getActionInputsModule, 'getActionInputs');
const helperSpy = spyOn(helperModule, 'createPrComment');
const setOutputSpy = spyOn(coreModule, 'setOutput');

// Import after setting up spies
const { run } = await import('../src/main');

const helper = 'create-pr-comment';
const otherInputs = {
  my: 'input',
  another: 'input'
};
const output = { data: {} } as any;
getInputSpy.mockReturnValue(helper);
getActionInputsSpy.mockReturnValue(otherInputs);
helperSpy.mockResolvedValue(output);

describe('main', () => {
  beforeEach(async () => {
    await run();
  });

  it('should call getActionInputs with correct params', () => {
    const requiredInputs = ['body'];
    expect(getActionInputsSpy).toHaveBeenCalledWith(requiredInputs);
  });

  it('should call helper with all inputs', () => {
    expect(helperSpy).toHaveBeenCalledWith(otherInputs);
  });

  it('should set output', () => {
    expect(setOutputSpy).toHaveBeenCalledWith('output', output);
  });
});
