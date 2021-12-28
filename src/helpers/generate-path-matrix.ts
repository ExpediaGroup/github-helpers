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

import { chunk, uniq } from 'lodash';
import { context } from '@actions/github';
import { getChangedFilepaths } from '../utils/get-changed-filepaths';
import micromatch from 'micromatch';

interface GeneratePathMatrix {
  paths: string;
  override_filter_paths?: string;
  override_filter_globs?: string;
  paths_no_filter?: string;
  batches?: string;
}

export const generatePathMatrix = async ({
  paths,
  override_filter_paths,
  override_filter_globs,
  paths_no_filter,
  batches
}: GeneratePathMatrix) => {
  const changedFiles = await getChangedFilepaths(context.issue.number);
  const shouldOverrideFilter = override_filter_globs
    ? micromatch(changedFiles, override_filter_globs.split('\n')).length > 0
    : changedFiles.some(changedFile => override_filter_paths?.split(/[\n,]/).includes(changedFile));
  const splitPaths = paths.split(/[\n,]/);
  const basePaths = shouldOverrideFilter
    ? splitPaths
    : splitPaths.filter(path => changedFiles.some(changedFile => changedFile.startsWith(path)));
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
