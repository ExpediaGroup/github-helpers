import {
  notifyUser
} from "../main-m03behqp.js";
import"../main-bd6vw39p.js";
import"../main-dkdfy8cx.js";
import {
  CORE_APPROVED_PR_LABEL
} from "../main-9c2herm2.js";
import {
  getCoreMemberLogins
} from "../main-fechn2dk.js";
import"../main-yvnzphn1.js";
import {
  require_lodash
} from "../main-kzxwm80c.js";
import {
  require_bluebird
} from "../main-ttmzs6m5.js";
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
import {
  info
} from "../main-q70tmm6g.js";
import {
  __toESM
} from "../main-wckvcay0.js";

// src/helpers/assign-pr-reviewers.ts
var import_bluebird = __toESM(require_bluebird(), 1);
var import_lodash = __toESM(require_lodash(), 1);
class AssignPrReviewer extends HelperInputs {
}
var assignPrReviewers = async ({
  teams,
  login,
  number_of_assignees = "1",
  slack_webhook_url,
  pull_number = String(context.issue.number)
}) => {
  const coreMemberLogins = await getCoreMemberLogins({ pull_number: context.issue.number, teams: teams?.split(`
`) });
  const {
    data: { user, labels }
  } = await octokit.pulls.get({ pull_number: context.issue.number, ...context.repo });
  if (login && coreMemberLogins.includes(login)) {
    info("Already a core member, no need to assign.");
    return;
  }
  if (labels?.find((label) => label.name === CORE_APPROVED_PR_LABEL)) {
    info("Already approved by a core member, no need to assign.");
    return;
  }
  const prAuthorUsername = user?.login;
  const filteredCoreMemberLogins = coreMemberLogins.filter((userName) => userName !== prAuthorUsername);
  const assignees = import_lodash.sampleSize(filteredCoreMemberLogins, Number(number_of_assignees));
  await octokit.issues.addAssignees({
    assignees,
    issue_number: Number(pull_number),
    ...context.repo
  });
  if (slack_webhook_url) {
    await import_bluebird.map(assignees, async (assignee) => notifyUser({
      login: assignee,
      pull_number: Number(pull_number),
      slack_webhook_url
    }), { concurrency: 1 });
  }
};
export {
  assignPrReviewers,
  AssignPrReviewer
};

//# debugId=5374D441971C908864756E2164756E21
