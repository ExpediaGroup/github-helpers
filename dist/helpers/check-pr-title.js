import {
  DEFAULT_PR_TITLE_REGEX
} from "../main-9c2herm2.js";
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
  setFailed
} from "../main-q70tmm6g.js";
import"../main-wckvcay0.js";

// src/helpers/check-pr-title.ts
class CheckPrTitle extends HelperInputs {
}
var checkPrTitle = async ({ pattern = DEFAULT_PR_TITLE_REGEX, pull_number }) => {
  const regex = new RegExp(pattern);
  const pullNumber = pull_number ? Number(pull_number) : context.issue.number;
  const {
    data: { title }
  } = await octokit.pulls.get({
    pull_number: pullNumber,
    ...context.repo
  });
  if (regex.test(title)) {
    return true;
  }
  setFailed(`Pull request title does not meet requirements. The title must match the following regex: ${pattern}`);
  return false;
};
export {
  checkPrTitle,
  CheckPrTitle
};

//# debugId=9A54DF641B4B9ABB64756E2164756E21
