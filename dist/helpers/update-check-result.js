import {
  context
} from "../main-nnwtk8w8.js";
import"../main-6sabwhac.js";
import"../main-36vzaw22.js";
import {
  octokit
} from "../main-fh8gy58w.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";

// src/helpers/update-check-result.ts
class UpdateCheckResult extends HelperInputs {
  context = "";
  sha = "";
  state = "";
}
var updateCheckResult = async ({ context: context2, sha, state, description }) => {
  const checks = await octokit.checks.listForRef({
    ref: sha,
    check_name: context2,
    ...context.repo
  });
  const check_run_id = checks.data.check_runs[0]?.id;
  if (!check_run_id) {
    throw new Error("Check run not found");
  }
  return octokit.checks.update({
    check_run_id,
    conclusion: state,
    output: {
      title: description ?? `Check updated to ${state}`,
      summary: "Check updated via update-check-result helper"
    },
    ...context.repo
  });
};
export {
  UpdateCheckResult,
  updateCheckResult
};

//# debugId=672A51EF5D1F2E2264756E2164756E21
