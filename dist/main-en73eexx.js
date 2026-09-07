import {
  info
} from "./main-36vzaw22.js";
import {
  context
} from "./main-nnwtk8w8.js";
import {
  octokit
} from "./main-fh8gy58w.js";
import {
  require_bluebird
} from "./main-es051p88.js";
import {
  HelperInputs
} from "./main-d5wrnkmf.js";
import {
  __toESM
} from "./main-syahy8j8.js";

// src/helpers/set-commit-status.ts
var import_bluebird = __toESM(require_bluebird(), 1);
class SetCommitStatus2 extends HelperInputs {
  sha = "";
  context = "";
  state = "";
}
var setCommitStatus2 = async ({ sha, context: context2, state, description, target_url, skip_if_already_set }) => {
  await import_bluebird.map(context2.split(`
`).filter(Boolean), async (context2) => {
    if (skip_if_already_set === "true") {
      const check_runs = await octokit.checks.listForRef({
        ...context.repo,
        ref: sha
      });
      const run = check_runs.data.check_runs.find(({ name }) => name === context2);
      const runCompletedAndIsValid = run?.status === "completed" && (run?.conclusion === "failure" || run?.conclusion === "success");
      if (runCompletedAndIsValid) {
        info(`${context2} already completed with a ${run.conclusion} conclusion.`);
        return;
      }
    }
    await octokit.repos.createCommitStatus({
      sha,
      context: context2,
      state,
      description,
      target_url,
      ...context.repo
    });
  });
};

export { SetCommitStatus2, setCommitStatus2 };

//# debugId=C0D8F2F6A2F5C54164756E2164756E21
