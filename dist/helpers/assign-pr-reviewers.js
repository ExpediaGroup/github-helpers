import {
  info
} from "../main-36vzaw22.js";
import {
  context
} from "../main-agjmamh8.js";
import"../main-5k5kzfdy.js";
import {
  octokit
} from "../main-e3smtmr1.js";
import {
  getCoreMemberLogins
} from "../main-vg2yd0f5.js";
import {
  notifyUser
} from "../main-hbrsqfvv.js";
import"../main-nztvzpzp.js";
import {
  CORE_APPROVED_PR_LABEL
} from "../main-jq9kgsp8.js";
import"../main-j9t824v1.js";
import {
  require_lodash
} from "../main-t2wes6yn.js";
import {
  require_bluebird
} from "../main-es051p88.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";
import {
  __toESM
} from "../main-syahy8j8.js";

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
  AssignPrReviewer,
  assignPrReviewers
};

//# debugId=100E63B1708C746D64756E2164756E21
