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

import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import { getChangedFilepaths } from '../utils/get-changed-filepaths';

export class GetChangedFiles extends HelperInputs {
  pattern?: string;
  delimiter?: string;
}

export const getChangedFiles = async ({ pattern, delimiter = ',' }: GetChangedFiles) => {
  const filePaths = await getChangedFilepaths(context.issue.number);
  const filteredFilePaths = pattern ? filePaths.filter(fileName => fileName.match(pattern)) : filePaths;
  return filteredFilePaths.join(delimiter);
};
