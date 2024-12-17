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
import { octokitGraphql } from '../octokit';
import { Repository } from '@octokit/graphql-schema';

export class GetMergeQueuePosition extends HelperInputs {
  pull_number?: string;
  max_queue_size?: string;
}

export const getMergeQueuePosition = async ({ pull_number, max_queue_size = '10' }: GetMergeQueuePosition) => {
  const data = await octokitGraphql<{ repository: Repository }>(`
query {
  repository(owner: "${context.repo.owner}", name: "${context.repo.repo}") {
    mergeQueue {
      entries(first: ${max_queue_size}) {
        nodes {
          pullRequest {
            number
          }
          position
        }
      }
    }
  }
}
`);
  return data.repository.mergeQueue?.entries?.nodes?.find(entry => entry?.pullRequest?.number === Number(pull_number))?.position;
};
