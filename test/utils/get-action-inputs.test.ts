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

import { afterEach, beforeEach, describe, it, expect, mock, spyOn } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

mock.module('fs', () => ({
  promises: {
    access: mock()
  },
  readFileSync: mock(() => ({
    toString: mock()
  }))
}));

const { getActionInputs } = await import('../../src/utils/get-action-inputs');
const { getInput } = await import('@actions/core');
const getInputsFromFileModule = await import('../../src/utils/get-inputs-from-file');

describe('getActionInputs', () => {
  const requiredInputs = ['input1'];

  beforeEach(() => {
    mock.clearAllMocks();
  });

  afterEach(() => {
    mock.restore();
  });

  it('should call getInput with correct params and return expected inputs', () => {
    const spy = spyOn(getInputsFromFileModule, 'getInputsFromFile').mockReturnValue(['input1', 'input2', 'input3']);
    const result = getActionInputs(requiredInputs);

    expect(getInput).toHaveBeenCalledWith('input1', { required: true });
    expect(getInput).toHaveBeenCalledWith('input2', { required: false });
    expect(getInput).toHaveBeenCalledWith('input3', { required: false });
    expect(result).toEqual({
      input1: 'input1',
      input3: 'input3'
    });
    spy.mockRestore();
  });

  it('should call getInput with trimWhiteSpace false for delimiter input', () => {
    const spy = spyOn(getInputsFromFileModule, 'getInputsFromFile').mockReturnValue(['input1', 'input2', 'delimiter']);
    const result = getActionInputs(requiredInputs);

    expect(getInput).toHaveBeenCalledWith('input1', { required: true });
    expect(getInput).toHaveBeenCalledWith('input2', { required: false });
    expect(getInput).toHaveBeenCalledWith('delimiter', { required: false, trimWhitespace: false });
    expect(result).toEqual({
      input1: 'input1',
      delimiter: 'delimiter'
    });
    spy.mockRestore();
  });
});
