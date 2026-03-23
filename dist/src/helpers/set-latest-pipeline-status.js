import {
  DEFAULT_PIPELINE_STATUS,
  PRODUCTION_ENVIRONMENT
} from "../../main-9c2herm2.js";
import {
  HelperInputs
} from "../../main-8h70j5cy.js";
import {
  octokit
} from "../../main-4c5nddsb.js";
import {
  context
} from "../../main-p94abnca.js";
import"../../main-9m3k9gt0.js";
import {
  info
} from "../../main-q70tmm6g.js";
import"../../main-wckvcay0.js";

// src/helpers/set-latest-pipeline-status.ts
class SetLatestPipelineStatus extends HelperInputs {
  sha = "";
}
var setLatestPipelineStatus = async ({
  sha,
  context: context2 = DEFAULT_PIPELINE_STATUS,
  environment = PRODUCTION_ENVIRONMENT
}) => {
  const { data: deployments } = await octokit.repos.listDeployments({
    environment,
    ...context.repo
  });
  const deployment_id = deployments.find(Boolean)?.id;
  if (!deployment_id) {
    info("No deployments found. Pipeline is clear!");
    return;
  }
  const { data: deploymentStatuses } = await octokit.repos.listDeploymentStatuses({
    deployment_id,
    ...context.repo
  });
  const deploymentStatus = deploymentStatuses.find(Boolean);
  if (!deploymentStatus) {
    return octokit.repos.createCommitStatus({
      sha,
      context: context2,
      state: "pending",
      ...context.repo
    });
  }
  const { state, description, target_url } = deploymentStatus;
  return octokit.repos.createCommitStatus({
    sha,
    context: context2,
    state: deploymentStateToPipelineStateMap[state] ?? "pending",
    description,
    target_url,
    ...context.repo
  });
};
var deploymentStateToPipelineStateMap = {
  in_progress: "pending",
  success: "success",
  failure: "failure",
  inactive: "error"
};
export {
  setLatestPipelineStatus,
  SetLatestPipelineStatus
};

//# debugId=CAECD4D78926E46964756E2164756E21
