import {
  info
} from "../main-36vzaw22.js";
import {
  READY_FOR_MERGE_PR_LABEL,
  QUEUED_FOR_MERGE_PREFIX,
  FIRST_QUEUED_PR_LABEL
} from "../main-jq9kgsp8.js";
import {
  context
} from "../main-nnwtk8w8.js";
import"../main-6sabwhac.js";
import {
  octokit
} from "../main-fh8gy58w.js";
import {
  removeLabelIfExists2
} from "../main-b3a18pad.js";
import {
  require_lodash
} from "../main-t2wes6yn.js";
import {
  require_bluebird
} from "../main-es051p88.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";
import {
  __toESM
} from "../main-syahy8j8.js";

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
        await removeLabelIfExists2(READY_FOR_MERGE_PR_LABEL, pr.number);
        if (queueLabel) {
          await removeLabelIfExists2(queueLabel.name, pr.number);
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
    const mostRecentStatus = import_lodash.orderBy(statusesPerContext[context2], "created_at", "desc")[0];
    return mostRecentStatus?.state === "pending";
  });
  if (someContextHasLatestStatusPending) {
    return;
  }
  const mostRecentStatus = import_lodash.orderBy(data, "created_at", "desc")[0];
  if (mostRecentStatus && timestampIsStale(mostRecentStatus.created_at, seconds)) {
    info("Removing stale PR from first queued position...");
    return Promise.all([removeLabelIfExists2(READY_FOR_MERGE_PR_LABEL, number), removeLabelIfExists2(FIRST_QUEUED_PR_LABEL, number)]);
  }
};
var timestampIsStale = (timestamp, seconds) => {
  const ageOfTimestampInMiliseconds = Date.now() - new Date(timestamp).getTime();
  const milisecondsConsideredStale = Number(seconds) * 1000;
  return ageOfTimestampInMiliseconds > milisecondsConsideredStale;
};
export {
  RemovePrFromMergeQueue,
  removePrFromMergeQueue
};

//# debugId=09D5EB7DC9F4D23E64756E2164756E21
