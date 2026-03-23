import {
  DEFAULT_PR_TITLE_REGEX
} from "../../main-9c2herm2.js";
import {
  HelperInputs
} from "../../main-8h70j5cy.js";
import {
  octokit
} from "../../main-4c5nddsb.js";
import {
  context
} from "../../main-p94abnca.js";
import"../../main-9m3k9gt0.js";
import {
  setFailed
} from "../../main-q70tmm6g.js";
import"../../main-wckvcay0.js";

// src/helpers/check-pr-title.ts
class CheckPrTitle extends HelperInputs {
}
var checkPrTitle = async ({ pattern = DEFAULT_PR_TITLE_REGEX }) => {
  const regex = new RegExp(pattern);
  const {
    data: { title }
  } = await octokit.pulls.get({
    pull_number: context.issue.number,
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

//# debugId=C2025280B7E6F40964756E2164756E21
