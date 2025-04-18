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

import { ChangedFilesList } from '../types/github';
import { context } from '@actions/github';
import { octokit } from '../octokit';

export const getChangedFilepaths = async (pull_number: number, ignore_deleted?: boolean) => {
  const changedFiles = await paginateAllChangedFilepaths(pull_number);
  const renamedPreviousFilenames = changedFiles
    .filter(({ status }) => status === 'renamed')
    .map(({ previous_filename }) => previous_filename)
    .filter(Boolean); // GitHub should always include previous_filename for renamed files, but just in case
  const processedFilenames = (ignore_deleted ? changedFiles.filter(({ status }) => status !== 'removed') : changedFiles).map(
    ({ filename }) => filename
  );
  return processedFilenames.concat(renamedPreviousFilenames);
};

const paginateAllChangedFilepaths = async (pull_number: number, page = 1): Promise<ChangedFilesList> => {
  const response = await octokit.pulls.listFiles({
    pull_number,
    per_page: 100,
    page,
    ...context.repo
  });
  if (!response.data.length) {
    return [];
  }
  return response.data.concat(await paginateAllChangedFilepaths(pull_number, page + 1));
};
