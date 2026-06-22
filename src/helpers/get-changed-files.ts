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
import { getChangedFilepaths, getChangedFilepathsFromShas } from '../utils/get-changed-filepaths';
import { getPrNumberFromMergeQueueRef } from '../utils/merge-queue';

export class GetChangedFiles extends HelperInputs {
  declare pattern?: string;
  declare delimiter?: string;
  declare ignore_deleted?: string;
  declare pull_number?: string;
}

export const getChangedFiles = async ({ pattern, delimiter = ',', ignore_deleted, pull_number }: GetChangedFiles) => {
  const ignoreDeleted = Boolean(ignore_deleted);
  let filePaths: string[];

  switch (context.eventName) {
    case 'push': {
      const { before, after } = context.payload as { before: string; after: string };
      filePaths = await getChangedFilepathsFromShas(before, after, ignoreDeleted);
      break;
    }
    case 'merge_group': {
      const pullNumber = pull_number ? Number(pull_number) : getPrNumberFromMergeQueueRef();
      filePaths = await getChangedFilepaths(pullNumber, ignoreDeleted);
      break;
    }
    default: {
      const pullNumber = pull_number ? Number(pull_number) : context.issue.number;
      filePaths = await getChangedFilepaths(pullNumber, ignoreDeleted);
    }
  }

  const filteredFilePaths = pattern ? filePaths.filter(fileName => fileName.match(pattern)) : filePaths;
  return filteredFilePaths.join(delimiter);
};
