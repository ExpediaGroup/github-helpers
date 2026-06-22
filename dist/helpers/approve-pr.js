import {
  octokit
} from "../main-4tezksf5.js";
import {
  context
} from "../main-byv6ddq4.js";
import"../main-9m3k9gt0.js";
import"../main-ebvxxjzg.js";
import"../main-wckvcay0.js";

// src/helpers/approve-pr.ts
var approvePr = async () => octokit.pulls.createReview({
  pull_number: context.issue.number,
  body: "Approved by bot",
  event: "APPROVE",
  ...context.repo
});
export {
  approvePr
};

//# debugId=51CB282434774E5964756E2164756E21
