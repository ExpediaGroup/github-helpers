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

import { generatePathMatrix } from '../../src/helpers/generate-path-matrix';
import { octokit } from '../../src/octokit';
import { context } from '@actions/github';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({ rest: { pulls: { listFiles: jest.fn() } } }))
}));

const file1 = 'file/path/1/file1.txt';
const file2 = 'something/totally/different/file1.ts';
const file3 = 'something/totally/crazy/file1.txt';
const file4 = 'something/totally/not/crazy/file1.md';
const file5 = 'something/totally/crazy/file1.js';
const pkg = 'package.json';
(octokit.pulls.listFiles as any).mockImplementation(async () => ({
  data: [
    {
      filename: file1
    },
    {
      filename: file2
    },
    {
      filename: file3
    },
    {
      filename: file4
    },
    {
      filename: file5
    },
    {
      filename: pkg
    }
  ]
}));

describe('generatePathMatrix', () => {
  const pull_number = '123';
  const filePath1 = 'something/totally/crazy';
  const filePath2 = 'file';
  const filePath3 = 'something/totally/random';
  const paths = `${filePath1},${filePath2},${filePath3}`;

  describe('no override filter paths case', () => {
    let result: any;

    beforeEach(async () => {
      result = await generatePathMatrix({
        paths,
        pull_number
      });
    });

    it('should call listFiles with correct params', () => {
      expect(octokit.pulls.listFiles).toHaveBeenCalledWith({
        pull_number: 123,
        per_page: 100,
        ...context.repo
      });
    });

    it('should return expected result', () => {
      expect(result).toEqual({
        include: [
          {
            path: filePath1
          },
          {
            path: filePath2
          }
        ]
      });
    });
  });

  describe('override filter paths case', () => {
    let result: any;
    const override_filter_paths = 'package.json\npackage-lock.json';

    beforeEach(async () => {
      result = await generatePathMatrix({
        paths,
        pull_number,
        override_filter_paths
      });
    });

    it('should call listFiles with correct params', () => {
      expect(octokit.pulls.listFiles).toHaveBeenCalledWith({
        pull_number: 123,
        per_page: 100,
        ...context.repo
      });
    });

    it('should return expected result', () => {
      expect(result).toEqual({
        include: [
          {
            path: filePath1
          },
          {
            path: filePath2
          },
          {
            path: filePath3
          }
        ]
      });
    });
  });

  describe('additional no-filter paths case', () => {
    let result: any;
    const extraPath = 'an/extra/path';

    beforeEach(async () => {
      result = await generatePathMatrix({
        paths: `${paths},${extraPath}`,
        pull_number,
        paths_no_filter: `${extraPath},${filePath1}`
      });
    });

    it('should call listFiles with correct params', () => {
      expect(octokit.pulls.listFiles).toHaveBeenCalledWith({
        pull_number: 123,
        per_page: 100,
        ...context.repo
      });
    });

    it('should return expected result', () => {
      expect(result).toEqual({
        include: [
          {
            path: filePath1
          },
          {
            path: filePath2
          },
          {
            path: extraPath
          }
        ]
      });
    });
  });

  describe('batches case', () => {
    let result: any;
    const override_filter_paths = 'package.json\npackage-lock.json';

    beforeEach(async () => {
      result = await generatePathMatrix({
        paths,
        pull_number,
        override_filter_paths,
        batches: '2'
      });
    });

    it('should call listFiles with correct params', () => {
      expect(octokit.pulls.listFiles).toHaveBeenCalledWith({
        pull_number: 123,
        per_page: 100,
        ...context.repo
      });
    });

    it('should return expected result', () => {
      expect(result).toEqual({
        include: [
          {
            path: `${filePath1},${filePath2}`
          },
          {
            path: filePath3
          }
        ]
      });
    });
  });
});
