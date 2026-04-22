import {
  setCommitStatus
} from "../main-3vz73ekb.js";
import {
  require_micromatch
} from "../main-v9jqraeg.js";
import {
  simpleGit
} from "../main-8cy5s7xq.js";
import {
  paginateAllOpenPullRequests
} from "../main-zd3p3dtn.js";
import"../main-dkdfy8cx.js";
import {
  require_bluebird
} from "../main-ttmzs6m5.js";
import {
  HelperInputs
} from "../main-8h70j5cy.js";
import {
  octokit
} from "../main-4c5nddsb.js";
import {
  context
} from "../main-6avxv4a6.js";
import"../main-9m3k9gt0.js";
import {
  error,
  info,
  setFailed,
  warning
} from "../main-q70tmm6g.js";
import {
  __toESM
} from "../main-wckvcay0.js";

// src/helpers/check-merge-safety.ts
var import_micromatch = __toESM(require_micromatch(), 1);
var import_bluebird = __toESM(require_bluebird(), 1);
var git = simpleGit();
var maxBranchNameLength = 50;
var COMMENT_PATHS_MARKER = "<!-- check-merge-safety-paths -->";

class CheckMergeSafety extends HelperInputs {
}
var checkMergeSafety = async (inputs) => {
  const isPrWorkflow = Boolean(context.issue.number);
  if (!isPrWorkflow) {
    return handlePushWorkflow(inputs);
  }
  const { data: pullRequest } = await octokit.pulls.get({ pull_number: context.issue.number, ...context.repo });
  const { state, message } = await setMergeSafetyStatus(pullRequest, inputs);
  if (state === "failure") {
    setFailed(message);
  }
};
var setMergeSafetyStatus = async (pullRequest, { context: context2 = "Merge Safety", ...inputs }) => {
  const { state, message } = await getMergeSafetyStateAndMessage(pullRequest, inputs);
  const hasExistingFailureStatus = await checkForExistingFailureStatus(pullRequest, context2);
  if (hasExistingFailureStatus && state === "failure") {
    const {
      head: {
        ref,
        user: { login: username }
      }
    } = pullRequest;
    const truncatedRef = ref.length > maxBranchNameLength ? `${ref.substring(0, maxBranchNameLength)}...` : ref;
    const truncatedBranchName = `${username}:${truncatedRef}`;
    info(`Found existing failure status for ${truncatedBranchName}, skipping setting new status`);
  } else {
    await setCommitStatus({
      sha: pullRequest.head.sha,
      state,
      context: context2,
      description: message,
      ...context.repo
    });
  }
  return { state, message };
};
var handlePushWorkflow = async (inputs) => {
  const pullRequests = await paginateAllOpenPullRequests();
  const filteredPullRequests = pullRequests.filter(({ base, draft }) => !draft && base.ref === base.repo.default_branch);
  await import_bluebird.map(filteredPullRequests, (pullRequest) => setMergeSafetyStatus(pullRequest, inputs));
};
var checkForExistingFailureStatus = async (pullRequest, context2) => {
  const { data } = await octokit.repos.getCombinedStatusForRef({
    ...context.repo,
    ref: pullRequest.head.sha
  });
  if (data.state === "failure") {
    const existingContext = data.statuses.find((status) => status.context === context2);
    return Boolean(existingContext);
  }
  return false;
};
var fetchSha = async (repoUrl, sha) => {
  try {
    await git.fetch(repoUrl, sha, { "--depth": 1 });
    info(`Fetched ${sha} from ${repoUrl}`);
  } catch (err) {
    info(`Failed to fetch ${sha} from ${repoUrl}: ${err.message}`);
    throw new Error(`Failed to fetch ${sha} from ${repoUrl}: ${err.message}`);
  }
};
var getDiffUsingGitCommand = async (repoUrl, baseSha, headSha) => {
  await fetchSha(repoUrl, baseSha);
  await fetchSha(repoUrl, headSha);
  try {
    const diff = await git.diff(["--name-only", baseSha, headSha]);
    return (diff ?? "").split(`
`).filter(Boolean);
  } catch (err) {
    error(`Failed to run local git diff for ${repoUrl}: ${err.message}`);
    throw new Error(`Failed to run local git diff for ${repoUrl}: ${err.message}`);
  }
};
var getDiff = async (compareBase, compareHead, basehead) => {
  let changedFileNames = [];
  try {
    const { data: { files: changedFiles } = {}, status } = await octokit.repos.compareCommitsWithBasehead({
      ...context.repo,
      basehead
    });
    if (status > 400) {
      throw { status };
    }
    changedFileNames = changedFiles?.map((file) => file.filename) ?? [];
  } catch (err) {
    info(`Failed to fetch diff: ${err.message} Status: ${err.status}`);
    if (err?.status === 406 || err?.message.includes("diff is taking too long to generate")) {
      info(`Attempting to generate diff using local git command`);
      if (compareBase.repo?.html_url) {
        changedFileNames = await getDiffUsingGitCommand(compareBase.repo?.html_url, compareBase.sha, compareHead.sha);
      } else {
        error(`Could not fetch repo url to run local git diff`);
        throw err;
      }
    } else {
      throw err;
    }
  }
  return changedFileNames;
};
var getMergeSafetyStateAndMessage = async (pullRequest, { paths, ignore_globs, override_filter_paths, override_filter_globs, match_comment_paths }) => {
  const {
    base: {
      repo: {
        default_branch,
        owner: { login: baseOwner }
      }
    },
    head: {
      ref,
      user: { login: username }
    }
  } = pullRequest;
  const branchName = `${username}:${ref}`;
  const diffAgainstUserBranch = `${branchName}...${baseOwner}:${default_branch}`;
  let fileNamesWhichBranchIsBehindOn;
  try {
    fileNamesWhichBranchIsBehindOn = await getDiff(pullRequest.head, pullRequest.base, diffAgainstUserBranch);
  } catch (err) {
    const message = diffErrorMessage(diffAgainstUserBranch, err.message);
    error(message);
    return { state: "failure", message };
  }
  const truncatedRef = ref.length > maxBranchNameLength ? `${ref.substring(0, maxBranchNameLength)}...` : ref;
  const truncatedBranchName = `${username}:${truncatedRef}`;
  if (match_comment_paths === "true") {
    const commentPaths = await getPathsFromComment(pullRequest.number);
    if (commentPaths.length) {
      info(`Found ${commentPaths.length} paths from PR comment`);
      const outdatedCommentPaths = commentPaths.filter((commentPath) => fileNamesWhichBranchIsBehindOn.some((file) => file.startsWith(commentPath + "/") || file === commentPath));
      if (outdatedCommentPaths.length) {
        error(buildErrorMessage(outdatedCommentPaths, "comment paths", truncatedBranchName));
        const displayPaths = outdatedCommentPaths.slice(0, 3).join(", ");
        const suffix = outdatedCommentPaths.length > 3 ? "..." : "";
        return {
          state: "failure",
          message: `Branch is behind on paths from comment: ${displayPaths}${suffix}. Please update with ${default_branch}.`
        };
      }
    } else {
      info("No paths found in PR comment, skipping comment path matching check");
    }
  }
  const globalFilesOutdatedOnBranch = override_filter_globs ? import_micromatch.default(fileNamesWhichBranchIsBehindOn, override_filter_globs.split(/[\n,]/)) : override_filter_paths ? fileNamesWhichBranchIsBehindOn.filter((changedFile) => override_filter_paths.split(/[\n,]/).includes(changedFile)) : [];
  if (globalFilesOutdatedOnBranch.length) {
    error(buildErrorMessage(globalFilesOutdatedOnBranch, "global files", truncatedBranchName));
    return {
      state: "failure",
      message: `This branch has one or more outdated global files. Please update with ${default_branch}.`
    };
  }
  const diffAgainstDefaultBranch = `${baseOwner}:${default_branch}...${branchName}`;
  let changedFileNames;
  try {
    changedFileNames = await getDiff(pullRequest.base, pullRequest.head, diffAgainstDefaultBranch);
  } catch (err) {
    const message = diffErrorMessage(diffAgainstDefaultBranch, err.message);
    error(message);
    return { state: "failure", message };
  }
  const changedFilesToIgnore = changedFileNames && ignore_globs ? import_micromatch.default(changedFileNames, ignore_globs.split(/[\n,]/)) : [];
  const filteredFileNames = changedFileNames?.filter((file) => !changedFilesToIgnore.includes(file));
  const allProjectDirectories = paths?.split(/[\n,]/);
  const changedProjectsOutdatedOnBranch = allProjectDirectories?.filter((dir) => fileNamesWhichBranchIsBehindOn.some((file) => file.includes(dir)) && filteredFileNames?.some((file) => file.includes(dir)));
  if (changedProjectsOutdatedOnBranch?.length) {
    error(buildErrorMessage(changedProjectsOutdatedOnBranch, "projects", truncatedBranchName));
    return {
      state: "failure",
      message: `This branch has one or more outdated projects. Please update with ${default_branch}.`
    };
  }
  const safeMessage = buildSuccessMessage(truncatedBranchName);
  info(safeMessage);
  return {
    state: "success",
    message: safeMessage
  };
};
var buildErrorMessage = (paths, pathType, branchName) => `
The following ${pathType} are outdated on branch ${branchName}

${paths.map((path) => `* ${path}`).join(`
`)}
`;
var diffErrorMessage = (basehead, message = "") => `Failed to generate diff for ${basehead}. Please verify SHAs are valid and try again.${message ? `
Error: ${message}` : ""}`;
var buildSuccessMessage = (branchName) => `Branch ${branchName} is safe to merge!`;
var getPathsFromComment = async (pullNumber) => {
  const { data: comments } = await octokit.issues.listComments({
    ...context.repo,
    issue_number: pullNumber
  });
  const pathsComment = comments.find((c) => c.body?.includes(COMMENT_PATHS_MARKER));
  if (!pathsComment?.body) {
    return [];
  }
  const jsonMatch = pathsComment.body.match(/```json\n([\s\S]*?)\n```/);
  if (!jsonMatch?.[1]) {
    return [];
  }
  try {
    const parsed = JSON.parse(jsonMatch[1]);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      return parsed;
    }
    return [];
  } catch {
    warning(`Failed to parse paths from PR #${pullNumber} comment`);
    return [];
  }
};
export {
  checkMergeSafety,
  CheckMergeSafety
};

//# debugId=8CCB3211353B88AF64756E2164756E21
