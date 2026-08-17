import {
  octokit
} from "../main-0559yt64.js";
import {
  context
} from "../main-gex27b9s.js";
import"../main-tntkhvke.js";
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
