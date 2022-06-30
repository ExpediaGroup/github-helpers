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
import { HelperInputs } from '../types/generated';
import { chunk, uniq } from 'lodash';
import { context } from '@actions/github';
import { getChangedFilepaths } from '../utils/get-changed-filepaths';
import micromatch from 'micromatch';

export class GeneratePathMatrix extends HelperInputs {
  paths?: string;
  globs?: string;
  override_filter_paths?: string;
  override_filter_globs?: string;
  paths_no_filter?: string;
  batches?: string;
}

export const generatePathMatrix = async ({
  paths,
  globs,
  /** paths that override the changed files filter, causing the action to return all paths */
  override_filter_paths,
  override_filter_globs,
  /** paths that will be returned regardless of their adherence to the filter */
  paths_no_filter,
  /** number of evenly-sized batches to separate matching paths into (returns comma-separated result) */
  batches
}: GeneratePathMatrix) => {
  const pathsToUse = paths || globs;
  if (!pathsToUse) {
    if (!paths_no_filter) {
      core.error('Must supply one of paths, globs, paths_no_filter');
      throw new Error();
    }
    const extraPaths: string[] = paths_no_filter?.split(/[\n,]/) ?? [];
    if (batches) {
      return {
        include: chunk(uniq(extraPaths), Math.ceil(extraPaths.length / Number(batches))).map(chunk => ({ path: chunk.join(',') }))
      };
    }
    return {
      include: extraPaths.map(path => ({ path }))
    };
  }
  const changedFiles = await getChangedFilepaths(context.issue.number);
  const shouldOverrideFilter = override_filter_globs
    ? micromatch(changedFiles, override_filter_globs.split('\n')).length > 0
    : changedFiles.some(changedFile => override_filter_paths?.split(/[\n,]/).includes(changedFile));
  const splitPaths = pathsToUse.split(/[\n,]/);
  const basePaths = shouldOverrideFilter
    ? splitPaths
    : paths
    ? splitPaths.filter(path => changedFiles.some(changedFile => changedFile.startsWith(path)))
    : splitPaths.filter(glob => micromatch(changedFiles, glob).length > 0);
  const extraPaths: string[] = paths_no_filter?.split(/[\n,]/) ?? [];
  const matrixValues = uniq(basePaths.concat(extraPaths));
  if (batches) {
    return {
      include: chunk(matrixValues, Math.ceil(matrixValues.length / Number(batches))).map(chunk => ({ path: chunk.join(',') }))
    };
  }

  return {
    include: matrixValues.map(path => ({ path }))
  };
};
