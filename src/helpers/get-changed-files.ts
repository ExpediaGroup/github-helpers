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

import { octokit } from '../octokit';
import { context } from '@actions/github';

interface GetChangedFiles {
  pull_number: string;
}

export const getChangedFiles = ({ pull_number }: GetChangedFiles) =>
  octokit.pulls
    .listFiles({
      pull_number: Number(pull_number),
      per_page: 100,
      ...context.repo
    })
    .then(listFilesResponse => listFilesResponse.data.map(file => file.filename).join(','));
