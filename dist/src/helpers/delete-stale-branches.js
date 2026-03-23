import {
  paginateAllBranches
} from "../../main-ke778w9b.js";
import {
  getDefaultBranch
} from "../../main-dbfe86ee.js";
import {
  paginateAllOpenPullRequests
} from "../../main-evbzarph.js";
import {
  SECONDS_IN_A_DAY
} from "../../main-9c2herm2.js";
import {
  require_bluebird
} from "../../main-ttmzs6m5.js";
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
  info
} from "../../main-q70tmm6g.js";
import {
  __toESM
} from "../../main-wckvcay0.js";

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
