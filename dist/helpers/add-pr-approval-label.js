import {
  CORE_APPROVED_PR_LABEL,
  PEER_APPROVED_PR_LABEL
} from "../main-jq9kgsp8.js";
import {
  context
} from "../main-agjmamh8.js";
import"../main-5k5kzfdy.js";
import"../main-36vzaw22.js";
import {
  octokit
} from "../main-e3smtmr1.js";
import {
  getCoreMemberLogins
} from "../main-vg2yd0f5.js";
import"../main-j9t824v1.js";
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
