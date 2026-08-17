import {
  paginateAllBranches
} from "../main-c6wqy9ex.js";
import {
  getDefaultBranch
} from "../main-r940x241.js";
import {
  paginateAllOpenPullRequests
} from "../main-6sp2ffs2.js";
import {
  SECONDS_IN_A_DAY
} from "../main-9c2herm2.js";
import {
  require_bluebird
} from "../main-ttmzs6m5.js";
import {
  HelperInputs
} from "../main-8h70j5cy.js";
import {
  octokit
} from "../main-0559yt64.js";
import {
  context
} from "../main-gex27b9s.js";
import"../main-tntkhvke.js";
import {
  info
} from "../main-ebvxxjzg.js";
import {
  __toESM
} from "../main-wckvcay0.js";

// src/helpers/delete-stale-branches.ts
var import_bluebird = __toESM(require_bluebird(), 1);
class DeleteStaleBranches extends HelperInputs {
}
var deleteStaleBranches = async ({ days = "30" } = {}) => {
  const openPullRequests = await paginateAllOpenPullRequests();
  const openPullRequestBranches = new Set(openPullRequests.map((pr) => pr.head.ref));
  const unprotectedBranches = await paginateAllBranches({ protectedBranches: false });
  const defaultBranch = await getDefaultBranch();
  const featureBranchesWithNoOpenPullRequest = unprotectedBranches.filter(({ name }) => !openPullRequestBranches.has(name) && name !== defaultBranch);
  const branchesWithUpdatedDates = await import_bluebird.map(featureBranchesWithNoOpenPullRequest, async ({ name, commit: { sha } }) => {
    const {
      data: {
        committer: { date }
      }
    } = await octokit.git.getCommit({
      commit_sha: sha,
      ...context.repo
    });
    return {
      name,
      date
    };
  }, { concurrency: 5 });
  const branchesToDelete = branchesWithUpdatedDates.filter(({ date }) => branchIsTooOld(date, days)).map(({ name }) => name);
  await import_bluebird.map(branchesToDelete, async (branch) => {
    info(`Deleting branch ${branch}...`);
    await octokit.git.deleteRef({
      ref: `heads/${branch}`,
      ...context.repo
    });
  }, { concurrency: 5 });
};
var branchIsTooOld = (dateLastUpdated, daysThreshold) => {
  const lastUpdated = new Date(dateLastUpdated);
  const now = Date.now();
  const timeSinceLastUpdated = now - lastUpdated.getTime();
  const threshold = Number(daysThreshold) * SECONDS_IN_A_DAY;
  return timeSinceLastUpdated > threshold;
};
export {
  deleteStaleBranches,
  DeleteStaleBranches
};

//# debugId=1F67AFDE1629D57364756E2164756E21
