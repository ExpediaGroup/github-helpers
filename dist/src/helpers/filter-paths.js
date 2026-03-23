import {
  getPrNumberFromMergeQueueRef
} from "../../main-9ty9m4xy.js";
import {
  require_micromatch
} from "../../main-v9jqraeg.js";
import"../../main-ke778w9b.js";
import {
  HelperInputs
} from "../../main-8h70j5cy.js";
import {
  octokit
} from "../../main-4c5nddsb.js";
import {
  context
} from "../../main-p94abnca.js";
import"../../main-9m3k9gt0.js";
import {
  error,
  info
} from "../../main-q70tmm6g.js";
import {
  __toESM
} from "../../main-wckvcay0.js";

// src/helpers/filter-paths.ts
var import_micromatch = __toESM(require_micromatch(), 1);
class FilterPaths extends HelperInputs {
}
var filterPaths = async ({ paths, globs, sha, packages, merge_queue_enabled }) => {
  if (!paths && !globs && !packages) {
    error("Must pass `globs` or `paths` or `packages` for filtering");
    return false;
  }
  let pull_number;
  if (context.eventName === "merge_group") {
    pull_number = getPrNumberFromMergeQueueRef();
  } else if (sha && merge_queue_enabled === "true") {
    const branchesResult = sha ? await octokit.repos.listBranchesForHeadCommit({
      commit_sha: sha,
      ...context.repo
    }) : undefined;
    const branchName = branchesResult?.data[0]?.name;
    pull_number = getPrNumberFromMergeQueueRef(branchName);
  } else if (sha) {
    const listPrsResult = await octokit.repos.listPullRequestsAssociatedWithCommit({
      commit_sha: sha,
      ...context.repo
    });
    const prFromSha = listPrsResult?.data.find(Boolean);
    if (!prFromSha)
      throw new Error(`No PR found for commit ${sha}`);
    pull_number = prFromSha.number;
  } else {
    pull_number = context.issue.number;
  }
  const { data } = await octokit.pulls.listFiles({
    per_page: 100,
    pull_number,
    ...context.repo
  });
  if (packages && hasRelevantPackageChanged(data, packages)) {
    return true;
  }
  const fileNames = data.map((file) => file.filename);
  if (globs) {
    if (paths)
      info("`paths` and `globs` inputs found, defaulting to use `globs` for filtering");
    return import_micromatch.default(fileNames, globs.split(`
`)).length > 0;
  } else if (paths) {
    const filePaths = paths.split(`
`);
    return fileNames.some((changedFile) => filePaths.some((filePath) => changedFile.startsWith(filePath)));
  }
};
var hasRelevantPackageChanged = (files, packages) => {
  const packageJson = files.find((file) => file.filename === "package.json");
  if (!packageJson) {
    return false;
  }
  return packages.split(`
`).some((pkg) => new RegExp(`(-|\\+)\\s*\\"${pkg}\\"`).test(packageJson.patch ?? ""));
};
export {
  filterPaths,
  FilterPaths
};

//# debugId=F57369BFE892E36464756E2164756E21
