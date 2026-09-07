import {
  context
} from "../main-agjmamh8.js";
import"../main-5k5kzfdy.js";
import"../main-36vzaw22.js";
import {
  octokit
} from "../main-e3smtmr1.js";

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

//# debugId=036A938A139D6C2F64756E2164756E21
