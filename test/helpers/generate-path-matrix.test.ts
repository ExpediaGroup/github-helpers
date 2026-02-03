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

import { describe, it, expect, Mock } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

const { generatePathMatrix } = await import('../../src/helpers/generate-path-matrix');
const { octokit } = await import('../../src/octokit');
const { context } = await import('@actions/github');

const file1 = 'file/path/1/file1.txt';
const file2 = 'packages/abc/file1.ts';
const file3 = 'packages/def/file1.txt';
const file4 = 'packages/ghi/more/dirs/file1.md';
const file5 = 'docs/xyz/file1.js';
const pkg = 'package.json';
(octokit.pulls.listFiles as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
  data:
    page === 1
      ? [
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
      : []
}));

describe('generatePathMatrix', () => {
  const filePath1 = 'packages/abc';
  const filePath2 = 'file';
  const filePath3 = 'packages/random';
  const fileGlob1 = '**/abc/**';
  const fileGlob2 = '**/xyz/**';
  const fileGlob3 = '**/random/**';
  const paths = `${filePath1},${filePath2},${filePath3}`;
  const globs = `${fileGlob1},${fileGlob2},${fileGlob3}`;

  describe('no override filter paths case', () => {
    it('should call listFiles with correct params', async () => {
      await generatePathMatrix({
        paths
      });
      expect(octokit.pulls.listFiles).toHaveBeenCalledWith({
        pull_number: 123,
        per_page: 100,
        page: 1,
        ...context.repo
      });
    });

    it('should return expected result', async () => {
      const result = await generatePathMatrix({
        paths
      });
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
    const override_filter_paths = 'package.json\npackage-lock.json';

    it('should call listFiles with correct params', async () => {
      await generatePathMatrix({
        paths,
        override_filter_paths
      });
      expect(octokit.pulls.listFiles).toHaveBeenCalledWith({
        pull_number: 123,
        per_page: 100,
        page: 1,
        ...context.repo
      });
    });

    it('should return expected result', async () => {
      const result = await generatePathMatrix({
        paths,
        override_filter_paths
      });
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

  describe('no override filter globs case', () => {
    it('should call listFiles with correct params', async () => {
      await generatePathMatrix({
        globs
      });
      expect(octokit.pulls.listFiles).toHaveBeenCalledWith({
        pull_number: 123,
        per_page: 100,
        page: 1,
        ...context.repo
      });
    });

    it('should return expected result', async () => {
      const result = await generatePathMatrix({
        globs
      });
      expect(result).toEqual({
        include: [
          {
            path: fileGlob1
          },
          {
            path: fileGlob2
          }
        ]
      });
    });
  });

  describe('override filter globs case', () => {
    const override_filter_globs = 'package.json\ntotally/crazy';

    it('should call listFiles with correct params', async () => {
      await generatePathMatrix({
        globs,
        override_filter_globs
      });
      expect(octokit.pulls.listFiles).toHaveBeenCalledWith({
        pull_number: 123,
        per_page: 100,
        page: 1,
        ...context.repo
      });
    });

    it('should return expected result', async () => {
      const result = await generatePathMatrix({
        globs,
        override_filter_globs
      });
      expect(result).toEqual({
        include: [
          {
            path: fileGlob1
          },
          {
            path: fileGlob2
          },
          {
            path: fileGlob3
          }
        ]
      });
    });
  });

  describe('additional no-filter paths case', () => {
    const extraPath = 'an/extra/path';

    it('should call listFiles with correct params', async () => {
      await generatePathMatrix({
        paths: `${paths},${extraPath}`,
        paths_no_filter: `${extraPath},${filePath1}`
      });
      expect(octokit.pulls.listFiles).toHaveBeenCalledWith({
        pull_number: 123,
        per_page: 100,
        page: 1,
        ...context.repo
      });
    });

    it('should return expected result', async () => {
      const result = await generatePathMatrix({
        paths: `${paths},${extraPath}`,
        paths_no_filter: `${extraPath},${filePath1}`
      });
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
    const override_filter_paths = 'package.json\npackage-lock.json';

    it('should call listFiles with correct params', async () => {
      await generatePathMatrix({
        paths,
        override_filter_paths,
        batches: '2'
      });

      expect(octokit.pulls.listFiles).toHaveBeenCalledWith({
        pull_number: 123,
        per_page: 100,
        page: 1,
        ...context.repo
      });
    });

    it('should return expected result', async () => {
      const result = await generatePathMatrix({
        paths,
        override_filter_paths,
        batches: '2'
      });

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
