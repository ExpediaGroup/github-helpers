import {
  info
} from "../main-36vzaw22.js";
import {
  DEFAULT_PIPELINE_STATUS,
  PRODUCTION_ENVIRONMENT
} from "../main-jq9kgsp8.js";
import {
  context
} from "../main-agjmamh8.js";
import"../main-5k5kzfdy.js";
import {
  octokit
} from "../main-e3smtmr1.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";

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
  SetLatestPipelineStatus,
  setLatestPipelineStatus
};

//# debugId=09E8C89B665D5CA764756E2164756E21
