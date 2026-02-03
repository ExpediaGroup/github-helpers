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

import { describe, it, expect, beforeEach, mock } from 'bun:test';
import type { Mock } from 'bun:test';

process.env.INPUT_GITHUB_TOKEN = 'mock-token';

const mockGetInput = mock((input: string) => (input === 'input2' ? '' : input));
const mockGetInputsFromFile = mock(() => []);

mock.module('@actions/core', () => ({
  getInput: mockGetInput,
  setOutput: () => {},
  setFailed: () => {},
  info: () => {},
  warning: () => {},
  error: () => {}
}));

mock.module('../../src/utils/get-inputs-from-file', () => ({
  getInputsFromFile: mockGetInputsFromFile
}));

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
const { getInputsFromFile } = await import('../../src/utils/get-inputs-from-file');

describe('getActionInputs', () => {
  const requiredInputs = ['input1'];

  beforeEach(() => {
    mock.clearAllMocks();
  });

  it('should call getInput with correct params and return expected inputs', () => {
    (getInputsFromFile as Mock<any>).mockReturnValue(['input1', 'input2', 'input3']);
    const result = getActionInputs(requiredInputs);

    expect(getInput).toHaveBeenCalledWith('input1', { required: true });
    expect(getInput).toHaveBeenCalledWith('input2', { required: false });
    expect(getInput).toHaveBeenCalledWith('input3', { required: false });
    expect(result).toEqual({
      input1: 'input1',
      input3: 'input3'
    });
  });

  it('should call getInput with trimWhiteSpace false for delimiter input', () => {
    (getInputsFromFile as Mock<any>).mockReturnValue(['input1', 'input2', 'delimiter']);
    const result = getActionInputs(requiredInputs);

    expect(getInput).toHaveBeenCalledWith('input1', { required: true });
    expect(getInput).toHaveBeenCalledWith('input2', { required: false });
    expect(getInput).toHaveBeenCalledWith('delimiter', { required: false, trimWhitespace: false });
    expect(result).toEqual({
      input1: 'input1',
      delimiter: 'delimiter'
    });
  });
});
