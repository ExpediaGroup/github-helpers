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

import { context } from '@actions/github';
import { octokit } from '../octokit';

interface FilterPaths {
  paths: string;
  pull_number: string;
}

export const filterPaths = ({ paths, pull_number }: FilterPaths) =>
  octokit.pulls
    .listFiles({
      per_page: 100,
      pull_number: Number(pull_number),
      ...context.repo
    })
    .then(listFilesResponse => {
      const filePaths = paths.split('\n');
      return listFilesResponse.data
        .map(file => file.filename)
        .some(changedFile => filePaths.some(filePath => changedFile.startsWith(filePath)));
    });
