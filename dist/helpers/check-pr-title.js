import {
  DEFAULT_PR_TITLE_REGEX
} from "../main-jq9kgsp8.js";
import {
  context
} from "../main-agjmamh8.js";
import"../main-5k5kzfdy.js";
import {
  setFailed
} from "../main-36vzaw22.js";
import {
  octokit
} from "../main-e3smtmr1.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";

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
  CheckPrTitle,
  checkPrTitle
};

//# debugId=F8990F94AD5C57DD64756E2164756E21
