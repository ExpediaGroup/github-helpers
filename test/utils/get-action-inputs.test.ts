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

import { getActionInputs } from '../../src/utils/get-action-inputs';
import { getInput } from '@actions/core';
import { getInputsFromFile } from '../../src/utils/get-inputs-from-file';
import { readFileSync } from 'fs';

jest.mock('../../src/utils/get-inputs-from-file');
jest.mock('@actions/core');
jest.mock('fs');

(getInputsFromFile as jest.Mock).mockReturnValue(['input1', 'input2', 'input3']);
(getInput as jest.Mock).mockImplementation(input => (input === 'input2' ? '' : input));
(readFileSync as jest.Mock).mockImplementation(() => ({
  toString: jest.fn()
}));

describe('getActionInputs', () => {
  it('should return expected inputs', () => {
    expect(getActionInputs()).toEqual({
      input1: 'input1',
      input3: 'input3'
    });
  });
});
