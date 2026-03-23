import {
  HelperInputs
} from "../main-8h70j5cy.js";
import {
  octokit
} from "../main-4c5nddsb.js";
import {
  context
} from "../main-p94abnca.js";
import"../main-9m3k9gt0.js";
import"../main-q70tmm6g.js";
import"../main-wckvcay0.js";

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
  reopenPr,
  ReopenPr
};

//# debugId=3F46A5E578C78FAB64756E2164756E21
