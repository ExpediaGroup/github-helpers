/*
Copyright 2022 Expedia, Inc.
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

import { paginateAllBranches } from './paginate-all-branches';
import { context } from '@actions/github';

export const getMergeQueueCommitHashes = async () => {
  const branches = await paginateAllBranches();
  const mergeQueueBranches = branches.filter(branch => branch.name.startsWith('gh-readonly-queue/'));
  return mergeQueueBranches.map(branch => branch.commit.sha);
};

export const getPrNumberFromMergeQueueRef = (ref = context.ref) => {
  const prNumber = Number(
    ref
      .split('/')
      .find(part => part.includes('pr-'))
      ?.match(/\d+/)?.[0]
  );
  if (isNaN(prNumber)) {
    throw new Error('Could not find PR number in merge queue ref.');
  }
  return prNumber;
};
