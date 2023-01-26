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

import { GITHUB_OPTIONS } from '../constants';
import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import { octokit } from '../octokit';

export class CreatePrComment extends HelperInputs {
  body = '';
  sha?: string;
  login?: string;
}

const emptyResponse = { data: [] };

const getPrsByCommit = async (sha?: string) => {
  const prs =
    (sha &&
      (await octokit.repos.listPullRequestsAssociatedWithCommit({
        commit_sha: sha,
        ...context.repo,
        ...GITHUB_OPTIONS
      }))) ||
    emptyResponse;

  return prs.data.find(Boolean)?.number;
};

const getCommentByUser = async (login?: string) => {
  const comments =
    (login &&
      (await octokit.issues.listComments({
        issue_number: context.issue.number,
        ...context.repo
      }))) ||
    emptyResponse;

  return comments.data.find(comment => comment?.user?.login === login)?.id;
};

export const createPrComment = async ({ body, sha, login }: CreatePrComment) => {
  if (!sha && !login) {
    return octokit.issues.createComment({
      body,
      issue_number: context.issue.number,
      ...context.repo
    });
  }

  const defaultPrNumber = context.issue.number;
  const prNumber = (await getPrsByCommit(sha)) ?? defaultPrNumber;
  const commentId = await getCommentByUser(login);

  if (commentId) {
    return octokit.issues.updateComment({
      comment_id: commentId,
      body,
      ...context.repo
    });
  } else {
    return octokit.issues.createComment({
      body,
      issue_number: prNumber,
      ...context.repo
    });
  }
};
