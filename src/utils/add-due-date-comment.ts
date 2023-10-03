import { CommentList, SingleComment } from '../types/github';
import { paginateAllCommentsOnIssue } from './paginate-comments-on-issue';
import { context } from '@actions/github';
import { octokit } from '../octokit';

export const addDueDateComment = async (deadline: number, createdDate: Date, issue_number: number, hasExistingComments: boolean) => {
  const commentList: CommentList = hasExistingComments ? await paginateAllCommentsOnIssue(issue_number) : [];
  // Create due date comment if there are no existing comments or the comment list does not contain a due date comment
  if (!hasExistingComments || commentList.findIndex((comment: SingleComment) => comment.body?.startsWith('This issue is due on')) === -1) {
    const dueDate = new Date(createdDate.getTime() + deadline * 86400000);

    await octokit.issues.createComment({
      issue_number,
      body: `This issue is due on ${dueDate.toDateString()}`,
      ...context.repo
    });
  }
};
