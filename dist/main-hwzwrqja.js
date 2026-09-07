import {
  context
} from "./main-nnwtk8w8.js";
import {
  octokit
} from "./main-fh8gy58w.js";
import {
  HelperInputs
} from "./main-d5wrnkmf.js";

// src/helpers/create-pr-comment.ts
class CreatePrComment2 extends HelperInputs {
  body = "";
}
var emptyResponse = { data: [] };
var getFirstPrByCommit = async (sha, repo_name, repo_owner_name) => {
  const prs = sha && await octokit.repos.listPullRequestsAssociatedWithCommit({
    commit_sha: sha,
    repo: repo_name ?? context.repo.repo,
    owner: repo_owner_name ?? context.repo.owner
  }) || emptyResponse;
  return prs.data.find(Boolean)?.number;
};
var getCommentByUser = async (login, pull_number, repo_name, repo_owner_name) => {
  const comments = login && await octokit.issues.listComments({
    issue_number: pull_number ? Number(pull_number) : context.issue.number,
    repo: repo_name ?? context.repo.repo,
    owner: repo_owner_name ?? context.repo.owner
  }) || emptyResponse;
  return comments.data.find((comment) => comment?.user?.login === login)?.id;
};
var createPrComment2 = async ({ body, sha, login, pull_number, repo_name, repo_owner_name }) => {
  const defaultPrNumber = context.issue.number;
  if (!sha && !login) {
    return octokit.issues.createComment({
      body,
      issue_number: pull_number ? Number(pull_number) : defaultPrNumber,
      repo: repo_name ?? context.repo.repo,
      owner: repo_owner_name ?? context.repo.owner
    });
  }
  const prNumber = await getFirstPrByCommit(sha, repo_name, repo_owner_name) ?? (pull_number ? Number(pull_number) : defaultPrNumber);
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

export { CreatePrComment2, createPrComment2 };

//# debugId=6A55C33424FC9A2664756E2164756E21
