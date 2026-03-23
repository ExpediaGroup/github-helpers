import {
  require_bluebird
} from "./main-ttmzs6m5.js";
import {
  HelperInputs
} from "./main-8h70j5cy.js";
import {
  octokit
} from "./main-4c5nddsb.js";
import {
  context
} from "./main-p94abnca.js";
import {
  info
} from "./main-q70tmm6g.js";
import {
  __toESM
} from "./main-wckvcay0.js";

// src/helpers/set-commit-status.ts
var import_bluebird = __toESM(require_bluebird(), 1);
class SetCommitStatus extends HelperInputs {
  sha = "";
  context = "";
  state = "";
}
var setCommitStatus = async ({ sha, context: context2, state, description, target_url, skip_if_already_set }) => {
  await import_bluebird.map(context2.split(`
`).filter(Boolean), async (context3) => {
    if (skip_if_already_set === "true") {
      const check_runs = await octokit.checks.listForRef({
        ...context.repo,
        ref: sha
      });
      const run = check_runs.data.check_runs.find(({ name }) => name === context3);
      const runCompletedAndIsValid = run?.status === "completed" && (run?.conclusion === "failure" || run?.conclusion === "success");
      if (runCompletedAndIsValid) {
        info(`${context3} already completed with a ${run.conclusion} conclusion.`);
        return;
      }
    }
    await octokit.repos.createCommitStatus({
      sha,
      context: context3,
      state,
      description,
      target_url,
      ...context.repo
    });
  });
};

export { SetCommitStatus, setCommitStatus };

//# debugId=5E7B4648CC42753764756E2164756E21
