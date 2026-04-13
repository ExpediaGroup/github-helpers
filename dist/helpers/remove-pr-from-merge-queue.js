import {
  removeLabelIfExists
} from "../main-fk67p72v.js";
import {
  FIRST_QUEUED_PR_LABEL,
  QUEUED_FOR_MERGE_PREFIX,
  READY_FOR_MERGE_PR_LABEL
} from "../main-9c2herm2.js";
import {
  require_lodash
} from "../main-pet5htdh.js";
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
  info
} from "../main-q70tmm6g.js";
import {
  __toESM
} from "../main-wckvcay0.js";

// src/helpers/remove-pr-from-merge-queue.ts
var import_lodash = __toESM(require_lodash(), 1);
var import_bluebird = __toESM(require_bluebird(), 1);

class RemovePrFromMergeQueue extends HelperInputs {
  seconds = "";
}
var removePrFromMergeQueue = async ({ seconds }) => {
  const { data: pullRequests } = await octokit.pulls.list({
    state: "open",
    per_page: 100,
    ...context.repo
  });
  const firstQueuedPr = pullRequests.find((pr) => pr.labels.some((label) => label.name === FIRST_QUEUED_PR_LABEL));
  if (!firstQueuedPr) {
    info("No PR is first in the merge queue.");
    return import_bluebird.map(pullRequests, async (pr) => {
      const readyForMergeLabel = pr.labels.find((label) => label.name.startsWith(READY_FOR_MERGE_PR_LABEL));
      const queueLabel = pr.labels.find((label) => label.name.startsWith(QUEUED_FOR_MERGE_PREFIX));
      if (readyForMergeLabel || queueLabel) {
        info(`Cleaning up queued PR #${pr.number}...`);
        await removeLabelIfExists(READY_FOR_MERGE_PR_LABEL, pr.number);
        if (queueLabel) {
          await removeLabelIfExists(queueLabel.name, pr.number);
        }
      }
    });
  }
  const {
    number,
    head: { sha }
  } = firstQueuedPr;
  const { data } = await octokit.repos.listCommitStatusesForRef({
    ref: sha,
    ...context.repo
  });
  const statusesPerContext = import_lodash.groupBy(data, "context");
  const someContextHasLatestStatusPending = Object.keys(statusesPerContext).some((context2) => {
    const mostRecentStatus2 = import_lodash.orderBy(statusesPerContext[context2], "created_at", "desc")[0];
    return mostRecentStatus2?.state === "pending";
  });
  if (someContextHasLatestStatusPending) {
    return;
  }
  const mostRecentStatus = import_lodash.orderBy(data, "created_at", "desc")[0];
  if (mostRecentStatus && timestampIsStale(mostRecentStatus.created_at, seconds)) {
    info("Removing stale PR from first queued position...");
    return Promise.all([removeLabelIfExists(READY_FOR_MERGE_PR_LABEL, number), removeLabelIfExists(FIRST_QUEUED_PR_LABEL, number)]);
  }
};
var timestampIsStale = (timestamp, seconds) => {
  const ageOfTimestampInMiliseconds = Date.now() - new Date(timestamp).getTime();
  const milisecondsConsideredStale = Number(seconds) * 1000;
  return ageOfTimestampInMiliseconds > milisecondsConsideredStale;
};
export {
  removePrFromMergeQueue,
  RemovePrFromMergeQueue
};

//# debugId=A087696D68A8A73A64756E2164756E21
