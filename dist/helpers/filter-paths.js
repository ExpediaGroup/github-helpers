import {
  getPrNumberFromMergeQueueRef
} from "../main-kqx5tf9g.js";
import {
  require_micromatch
} from "../main-v9jqraeg.js";
import"../main-qxfdnkb5.js";
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
  info
} from "../main-q70tmm6g.js";
import {
  __toESM
} from "../main-wckvcay0.js";

// src/helpers/filter-paths.ts
var import_micromatch = __toESM(require_micromatch(), 1);
class FilterPaths extends HelperInputs {
}
var filterPaths = async ({ paths, globs, sha, packages, dependencies, merge_queue_enabled, pull_number }) => {
  if (!paths && !globs && !packages && !dependencies) {
    error("Must pass `globs` or `paths` or `packages` or `dependencies` for filtering");
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
  if (dependencies && hasRelevantDependencyChanged(data, dependencies)) {
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
var hasRelevantDependencyChanged = (files, dependencies) => {
  const buildGradleKts = files.find((file) => file.filename === "build.gradle.kts");
  const buildGradle = files.find((file) => file.filename === "build.gradle");
  const buildFile = buildGradleKts ?? buildGradle;
  if (!buildFile) {
    return false;
  }
  return dependencies.split(`
`).some((dep) => new RegExp(`(-|\\+)\\s*implementation\\(\\"${dep}`).test(buildFile.patch ?? ""));
};
export {
  filterPaths,
  FilterPaths
};

//# debugId=2F7263BBC180B17164756E2164756E21
