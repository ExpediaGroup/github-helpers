import {
  CORE_APPROVED_PR_LABEL,
  PEER_APPROVED_PR_LABEL
} from "../main-jq9kgsp8.js";
import {
  context
} from "../main-nnwtk8w8.js";
import"../main-6sabwhac.js";
import"../main-36vzaw22.js";
import {
  octokit
} from "../main-fh8gy58w.js";
import {
  getCoreMemberLogins
} from "../main-33hyq3fg.js";
import"../main-8fvwf10s.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";

// src/helpers/add-pr-approval-label.ts
class AddPrApprovalLabel extends HelperInputs {
  login = "";
}
var addPrApprovalLabel = async ({ teams, login }) => {
  const coreMemberLogins = await getCoreMemberLogins({ pull_number: context.issue.number, teams: teams?.split(`
`) });
  const approvalLabel = coreMemberLogins.includes(login) ? CORE_APPROVED_PR_LABEL : PEER_APPROVED_PR_LABEL;
  return octokit.issues.addLabels({
    labels: [approvalLabel],
    issue_number: context.issue.number,
    ...context.repo
  });
};
export {
  AddPrApprovalLabel,
  addPrApprovalLabel
};

//# debugId=8EE91A16076B833C64756E2164756E21
