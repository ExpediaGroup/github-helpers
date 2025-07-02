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
import { octokit } from '../octokit';

export class CreatePrComment extends HelperInputs {
  body = '';
  declare sha?: string;
  declare login?: string;
  declare pull_number?: string;
  declare repo_name?: string;
  declare repo_owner_name?: string;
}

const emptyResponse = { data: [] };

const getFirstPrByCommit = async (sha?: string, repo_name?: string, repo_owner_name?: string) => {
  const prs =
    (sha &&
      (await octokit.repos.listPullRequestsAssociatedWithCommit({
        commit_sha: sha,
        repo: repo_name ?? context.repo.repo,
        owner: repo_owner_name ?? context.repo.owner
      }))) ||
    emptyResponse;

  return prs.data.find(Boolean)?.number;
};

const getCommentByUser = async (login?: string, pull_number?: string, repo_name?: string, repo_owner_name?: string) => {
  const comments =
    (login &&
      (await octokit.issues.listComments({
        issue_number: pull_number ? Number(pull_number) : context.issue.number,
        repo: repo_name ?? context.repo.repo,
        owner: repo_owner_name ?? context.repo.owner
      }))) ||
    emptyResponse;

  return comments.data.find(comment => comment?.user?.login === login)?.id;
};

export const createPrComment = async ({ body, sha, login, pull_number, repo_name, repo_owner_name }: CreatePrComment) => {
  const defaultPrNumber = context.issue.number;

  if (!sha && !login) {
    return octokit.issues.createComment({
      body,
      issue_number: pull_number ? Number(pull_number) : defaultPrNumber,
      repo: repo_name ?? context.repo.repo,
      owner: repo_owner_name ?? context.repo.owner
    });
  }

  const prNumber = (await getFirstPrByCommit(sha, repo_name, repo_owner_name)) ?? (pull_number ? Number(pull_number) : defaultPrNumber);
  const commentId = await getCommentByUser(login, pull_number, repo_name, repo_owner_name);

  if (commentId) {
    return octokit.issues.updateComment({
      comment_id: commentId,
      body,
      repo: repo_name ?? context.repo.repo,
      owner: repo_owner_name ?? context.repo.owner
    });
  } else {
    return octokit.issues.createComment({
      body,
      issue_number: prNumber,
      repo: repo_name ?? context.repo.repo,
      owner: repo_owner_name ?? context.repo.owner
    });
  }
};
