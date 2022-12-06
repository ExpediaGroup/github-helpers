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
  glob_filter_paths?: string;
}

export const getChangedFiles = async ({ glob_filter_paths }: GetChangedFiles) =>
  (await getChangedFilepaths(context.issue.number))
    .map(fileName => fileName.match(glob_filter_paths || '[\\s\\S]*'))
    ?.filter(localizationFile => localizationFile !== null)
    .join(',');
