import {
  context
} from "../main-agjmamh8.js";
import"../main-5k5kzfdy.js";
import"../main-36vzaw22.js";
import {
  octokit
} from "../main-e3smtmr1.js";
import {
  createPrComment2
} from "../main-gq0fr5yq.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";

// src/helpers/close-pr.ts
class ClosePr extends HelperInputs {
}
var closePr = async ({ body, pull_number, repo_name, repo_owner_name } = {}) => {
  if ((repo_name || repo_owner_name) && !pull_number) {
    throw new Error("pull_number is required when repo_name or repo_owner_name is provided");
  }
  if (body) {
    await createPrComment2({ body, pull_number, repo_name, repo_owner_name });
  }
  return octokit.pulls.update({
    pull_number: pull_number ? Number(pull_number) : context.issue.number,
    repo: repo_name ?? context.repo.repo,
    owner: repo_owner_name ?? context.repo.owner,
    state: "closed"
  });
};
export {
  ClosePr,
  closePr
};

//# debugId=A515656405E32F4E64756E2164756E21
