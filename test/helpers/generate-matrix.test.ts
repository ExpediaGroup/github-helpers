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

import { generateMatrix } from '../../src/helpers/generate-matrix';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn()
}));

describe('generateMatrix', () => {
  it('should generate matrix json with appropriate batching', () => {
    const result = generateMatrix({ paths: 'path/1,path/2,path/3,path/4,path/5', batches: '3' });
    expect(result).toEqual({
      include: [
        {
          path: 'path/1,path/2'
        },
        {
          path: 'path/3,path/4'
        },
        {
          path: 'path/5'
        }
      ]
    });
  });
});
