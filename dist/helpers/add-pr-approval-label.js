import {
  CORE_APPROVED_PR_LABEL,
  PEER_APPROVED_PR_LABEL
} from "../main-9c2herm2.js";
import {
  getCoreMemberLogins
} from "../main-fb6evf2x.js";
import"../main-mycz0558.js";
import"../main-pet5htdh.js";
import"../main-ttmzs6m5.js";
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
import"../main-q70tmm6g.js";
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
