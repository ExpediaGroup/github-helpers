import {
  paginateAllBranches
} from "./main-wzm5rvxy.js";
import {
  context
} from "./main-byv6ddq4.js";

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
