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
import { getInputsFromFile } from '../../src/utils/get-inputs-from-file';
describe('getInputsFromFile', () => {
    const yamlContents = `
name: Create PR Comment
description: 'Creates a new issue comment for a pull request'
inputs:
  input1:
    description: 'The github helper to invoke'
    required: true
  input2:
    description: 'The comment body'
    required: false
runs:
  using: 'node12'
  main: 'dist/index.js'
`;
    it('should return expected inputs', () => {
        expect(getInputsFromFile(yamlContents)).toEqual(['input1', 'input2']);
    });
});
//# sourceMappingURL=get-inputs-from-file.test.js.map