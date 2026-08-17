import {
  CORE_APPROVED_PR_LABEL,
  PEER_APPROVED_PR_LABEL
} from "../main-9c2herm2.js";
import {
  getCoreMemberLogins
} from "../main-d5t2z2fg.js";
import"../main-p3eryrkf.js";
import"../main-pet5htdh.js";
import"../main-ttmzs6m5.js";
import {
  HelperInputs
} from "../main-8h70j5cy.js";
import {
  octokit
} from "../main-0559yt64.js";
import {
  context
} from "../main-gex27b9s.js";
import"../main-tntkhvke.js";
import"../main-ebvxxjzg.js";
import"../main-wckvcay0.js";

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
  addPrApprovalLabel,
  AddPrApprovalLabel
};

//# debugId=08014975F5D4540664756E2164756E21
