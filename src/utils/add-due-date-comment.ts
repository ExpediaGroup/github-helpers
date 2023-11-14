/*
Copyright 2023 Expedia, Inc.
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

import { IssueAssignees, CommentList, SingleComment } from '../types/github';
import { paginateAllCommentsOnIssue } from './paginate-comments-on-issue';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { SECONDS_IN_A_DAY } from '../constants';

export const addDueDateComment = async (deadline: number, createdDate: Date, issue_number: number) => {
  const commentList: CommentList = await paginateAllCommentsOnIssue(issue_number);
  if (
    !commentList ||
    !commentList.find(
      (comment: SingleComment) => comment.user?.login === 'github-actions[bot]' && comment.body?.startsWith('This issue is due on')
    )
  ) {
    const dueDate = new Date(createdDate.getTime() + deadline * SECONDS_IN_A_DAY);

    await octokit.issues.createComment({
      issue_number,
      body: `This issue is due on ${dueDate.toDateString()}`,
      ...context.repo
    });
  }
};

export const pingAssigneesForDueDate = async (assignees: IssueAssignees, labelToAdd: string, issue_number: number) => {
  const commentList: CommentList = await paginateAllCommentsOnIssue(issue_number);

  assignees?.map(async assignee => {
    const commentToAdd = `@${assignee.name || assignee.login}, this issue assigned to you is now ${labelToAdd.toLowerCase()}`;
    if (!commentList?.find((comment: SingleComment) => comment.user?.login === 'github-actions[bot]' && comment.body === commentToAdd)) {
      await octokit.issues.createComment({
        issue_number,
        body: commentToAdd,
        ...context.repo
      });
    }
  });
};
