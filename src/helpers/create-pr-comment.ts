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

interface CreatePrComment {
  body: string;
  login?: string;
}

export const createPrComment = async ({ body, login }: CreatePrComment) => {
  if (login) {
    const commentsResponse = await octokit.issues.listComments({
      issue_number: context.issue.number,
      ...context.repo
    });
    const comment_id = commentsResponse.data.find(comment => comment?.user?.login === login)?.id;
    if (comment_id) {
      return octokit.issues.updateComment({
        comment_id,
        body,
        ...context.repo
      });
    }
  }
  return octokit.issues.createComment({
    body,
    issue_number: context.issue.number,
    ...context.repo
  });
};
