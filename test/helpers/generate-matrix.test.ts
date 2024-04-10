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

  it('should generate matrix json with appropriate load balancing in small case', () => {
    const result = generateMatrix({
      paths: 'path/1,path/2,path/3,path/4',
      load_balancing_sizes: '3,1,1,1',
      batches: '2'
    });
    expect(result).toEqual({
      include: [
        {
          path: 'path/1'
        },
        {
          path: 'path/2,path/3,path/4'
        }
      ]
    });
  });

  it('should generate matrix json with appropriate load balancing in medium case', () => {
    const result = generateMatrix({
      paths: 'path/1,path/2,path/3,path/4,path/5,path/6',
      load_balancing_sizes: '2,4,1,12,6,2',
      batches: '3'
    });
    expect(result).toEqual({
      include: [
        {
          path: 'path/1,path/2,path/3'
        },
        {
          path: 'path/4'
        },
        {
          path: 'path/5,path/6'
        }
      ]
    });
  });

  it('should generate matrix json with appropriate load balancing in larger case', () => {
    const result = generateMatrix({
      paths: 'path/1,path/2,path/3,path/4,path/5,path/6,path/7,path/8,path/9,path/10,path/11,path/12',
      load_balancing_sizes: '2,4,1,12,6,2,3,5,1,17,4,2',
      batches: '4'
    });
    expect(result).toEqual({
      include: [
        {
          path: 'path/1,path/2,path/3'
        },
        {
          path: 'path/4,path/5'
        },
        {
          path: 'path/6,path/7,path/8,path/9'
        },
        {
          path: 'path/10'
        },
        {
          path: 'path/11,path/12'
        }
      ]
    });
  });
});
