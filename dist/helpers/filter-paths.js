import {
  error,
  info
} from "../main-36vzaw22.js";
import {
  context
} from "../main-nnwtk8w8.js";
import"../main-6sabwhac.js";
import {
  octokit
} from "../main-fh8gy58w.js";
import {
  getPrNumberFromMergeQueueRef
} from "../main-g4wfn82f.js";
import {
  require_micromatch
} from "../main-hatr91y7.js";
import"../main-00tcd9f5.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";
import {
  __toESM
} from "../main-syahy8j8.js";

// src/helpers/filter-paths.ts
var import_micromatch = __toESM(require_micromatch(), 1);
class FilterPaths extends HelperInputs {
}
var filterPaths = async ({ paths, globs, sha, packages, merge_queue_enabled, pull_number }) => {
  if (!paths && !globs && !packages) {
    error("Must pass `globs` or `paths` or `packages` for filtering");
    return false;
  }
  let pullNumber;
  if (pull_number) {
    pullNumber = Number(pull_number);
  } else if (context.eventName === "merge_group") {
    pullNumber = getPrNumberFromMergeQueueRef();
  } else if (sha && merge_queue_enabled === "true") {
    const branchesResult = sha ? await octokit.repos.listBranchesForHeadCommit({
      commit_sha: sha,
      ...context.repo
    }) : undefined;
    const branchName = branchesResult?.data[0]?.name;
    pullNumber = getPrNumberFromMergeQueueRef(branchName);
  } else if (sha) {
    const listPrsResult = await octokit.repos.listPullRequestsAssociatedWithCommit({
      commit_sha: sha,
      ...context.repo
    });
    const prFromSha = listPrsResult?.data.find(Boolean);
    if (!prFromSha) {
      throw new Error(`No PR found for commit ${sha}`);
    }
    pullNumber = prFromSha.number;
  } else {
    pullNumber = context.issue.number;
  }
  const { data } = await octokit.pulls.listFiles({
    per_page: 100,
    pull_number: pullNumber,
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
  FilterPaths,
  filterPaths
};

//# debugId=F4C7268721DA53E864756E2164756E21
