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
import { octokit, octokitGraphql } from '../octokit';
import { Repository } from '@octokit/graphql-schema';

export class GetMergeQueuePosition extends HelperInputs {
  sha = '';
  max_queue_size?: string;
}

export const getMergeQueuePosition = async ({ sha, max_queue_size = '10' }: GetMergeQueuePosition) => {
  const { repository } = await octokitGraphql<{ repository: Repository }>(`
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
  const { data: pullRequests } = await octokit.repos.listPullRequestsAssociatedWithCommit({
    commit_sha: sha,
    ...context.repo
  });
  const pullRequestNumber = pullRequests.find(Boolean)?.number;
  const mergeQueueEntries = repository.mergeQueue?.entries?.nodes;
  return mergeQueueEntries?.find(entry => entry?.pullRequest?.number === Number(pullRequestNumber))?.position;
};