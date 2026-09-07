import {
  context
} from "../main-agjmamh8.js";
import"../main-5k5kzfdy.js";
import {
  info
} from "../main-36vzaw22.js";
import {
  octokit
} from "../main-e3smtmr1.js";
import {
  SECONDS_IN_A_DAY
} from "../main-jq9kgsp8.js";
import {
  paginateAllBranches
} from "../main-9fzkbq68.js";
import {
  getDefaultBranch
} from "../main-khtnpn98.js";
import {
  paginateAllOpenPullRequests
} from "../main-8kbaft6h.js";
import {
  require_bluebird
} from "../main-es051p88.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";
import {
  __toESM
} from "../main-syahy8j8.js";

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
  DeleteStaleBranches,
  deleteStaleBranches
};

//# debugId=3F7EC27DA27ABFD064756E2164756E21
