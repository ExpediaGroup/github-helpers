import {
  paginateAllBranches
} from "./main-qxfdnkb5.js";
import {
  context
} from "./main-6avxv4a6.js";

// src/utils/merge-queue.ts
var getMergeQueueCommitHashes = async () => {
  const branches = await paginateAllBranches();
  const mergeQueueBranches = branches.filter((branch) => branch.name.startsWith("gh-readonly-queue/"));
  return mergeQueueBranches.map((branch) => branch.commit.sha);
};
var getPrNumberFromMergeQueueRef = (ref = context.ref) => {
  const prNumber = Number(ref.split("/").find((part) => part.includes("pr-"))?.match(/\d+/)?.[0]);
  if (isNaN(prNumber)) {
    throw new Error("Could not find PR number in merge queue ref.");
  }
  return prNumber;
};

export { getMergeQueueCommitHashes, getPrNumberFromMergeQueueRef };

//# debugId=2506B878F1050C0064756E2164756E21
