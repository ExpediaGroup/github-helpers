import { CommentList, SingleComment } from '../types/github';
import { paginateAllCommentsOnIssue } from './paginate-comments-on-issue';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { SECONDS_IN_A_DAY } from '../constants';

export const addDueDateComment = async (deadline: number, createdDate: Date, issue_number: number, numComments: number) => {
  const hasExistingComments = numComments > 0;
  const commentList: CommentList = hasExistingComments ? await paginateAllCommentsOnIssue(issue_number) : [];
  // Create due date comment if there are no existing comments or the comment list does not contain a due date comment
  if (!hasExistingComments || !commentList.find((comment: SingleComment) => comment.body?.startsWith('This issue is due on'))) {
    const dueDate = new Date(createdDate.getTime() + deadline * SECONDS_IN_A_DAY);

    await octokit.issues.createComment({
      issue_number,
      body: `This issue is due on ${dueDate.toDateString()}`,
      ...context.repo
    });
  }
};
