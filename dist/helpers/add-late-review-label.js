import {
  SECONDS_IN_A_DAY,
  LATE_REVIEW
} from "../main-jq9kgsp8.js";
import {
  context
} from "../main-agjmamh8.js";
import"../main-5k5kzfdy.js";
import"../main-36vzaw22.js";
import {
  octokit
} from "../main-e3smtmr1.js";
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

// src/helpers/add-late-review-label.ts
var import_bluebird = __toESM(require_bluebird(), 1);
class AddLateReviewLabel extends HelperInputs {
}
var addLateReviewLabel = async ({ days = "1" }) => {
  const openPullRequests = await paginateAllOpenPullRequests();
  return import_bluebird.map(openPullRequests, (pr) => {
    if (!isLabelNeeded(pr, Number(days))) {
      return;
    }
    return octokit.issues.addLabels({
      labels: [LATE_REVIEW],
      issue_number: pr.number,
      ...context.repo
    });
  });
};
var isLabelNeeded = ({ requested_reviewers, requested_teams, updated_at }, days) => {
  const last_updated = new Date(updated_at);
  const now = new Date;
  const timeSinceLastUpdated = now.getTime() - last_updated.getTime();
  const dayThreshold = days * SECONDS_IN_A_DAY;
  const isWaitingOnReviewers = Boolean(requested_reviewers || requested_teams);
  return timeSinceLastUpdated > dayThreshold && isWaitingOnReviewers;
};
export {
  AddLateReviewLabel,
  addLateReviewLabel
};

//# debugId=172D175E3F360C1864756E2164756E21
