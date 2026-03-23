import {
  createPrComment
} from "../../main-twjwvv0a.js";
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
import"../../main-q70tmm6g.js";
import"../../main-wckvcay0.js";

// src/helpers/close-pr.ts
class ClosePr extends HelperInputs {
}
var closePr = async ({ body, pull_number, repo_name, repo_owner_name } = {}) => {
  if ((repo_name || repo_owner_name) && !pull_number) {
    throw new Error("pull_number is required when repo_name or repo_owner_name is provided");
  }
  if (body) {
    await createPrComment({ body, pull_number, repo_name, repo_owner_name });
  }
  return octokit.pulls.update({
    pull_number: pull_number ? Number(pull_number) : context.issue.number,
    repo: repo_name ?? context.repo.repo,
    owner: repo_owner_name ?? context.repo.owner,
    state: "closed"
  });
};
export {
  closePr,
  ClosePr
};

//# debugId=10A40351AA5951D964756E2164756E21
