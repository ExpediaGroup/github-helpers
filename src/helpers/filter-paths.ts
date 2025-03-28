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
import { context } from '@actions/github';
import micromatch from 'micromatch';
import { octokit } from '../octokit';
import { getPrNumberFromMergeQueueRef } from '../utils/merge-queue';

export class FilterPaths extends HelperInputs {
  paths?: string;
  globs?: string;
}

export const filterPaths = async ({ paths, globs }: FilterPaths) => {
  const pull_number = context.eventName === 'merge_group' ? getPrNumberFromMergeQueueRef() : context.issue.number;

  const { data } = await octokit.pulls.listFiles({
    per_page: 100,
    pull_number,
    ...context.repo
  });

  const fileNames = data.map(file => file.filename);
  if (globs) {
    if (paths) core.info('`paths` and `globs` inputs found, defaulting to use `globs` for filtering');
    return micromatch(fileNames, globs.split('\n')).length > 0;
  } else if (paths) {
    const filePaths = paths.split('\n');
    return fileNames.some(changedFile => filePaths.some(filePath => changedFile.startsWith(filePath)));
  } else {
    core.error('Must pass `globs` or `paths` for filtering');
  }
};
