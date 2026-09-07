import {
  context
} from "../main-agjmamh8.js";
import"../main-5k5kzfdy.js";
import"../main-36vzaw22.js";
import {
  octokit
} from "../main-e3smtmr1.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";

// src/helpers/reopen-pr.ts
class ReopenPr extends HelperInputs {
}
var reopenPr = async ({ pull_number, repo_name, repo_owner_name } = {}) => {
  if ((repo_name || repo_owner_name) && !pull_number) {
    throw new Error("pull_number is required when repo_name or repo_owner_name is provided");
  }
  return octokit.pulls.update({
    pull_number: pull_number ? Number(pull_number) : context.issue.number,
    repo: repo_name ?? context.repo.repo,
    owner: repo_owner_name ?? context.repo.owner,
    state: "open"
  });
};
export {
  ReopenPr,
  reopenPr
};

//# debugId=C7BD1595D216A08864756E2164756E21
