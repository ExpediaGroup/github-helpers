import {
  octokit
} from "../main-4c5nddsb.js";
import {
  context
} from "../main-p94abnca.js";
import"../main-9m3k9gt0.js";
import"../main-q70tmm6g.js";
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
