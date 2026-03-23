import {
  paginateAllOpenPullRequests
} from "../main-evbzarph.js";
import {
  LATE_REVIEW,
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
} from "../main-4c5nddsb.js";
import {
  context
} from "../main-p94abnca.js";
import"../main-9m3k9gt0.js";
import"../main-q70tmm6g.js";
import {
  __toESM
} from "../main-wckvcay0.js";

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
  addLateReviewLabel,
  AddLateReviewLabel
};

//# debugId=9F00FD243F8100D664756E2164756E21
