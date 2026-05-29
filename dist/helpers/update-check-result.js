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
  updateCheckResult,
  UpdateCheckResult
};

//# debugId=2DCF138D688D5F5964756E2164756E21
