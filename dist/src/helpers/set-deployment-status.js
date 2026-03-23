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
import"../../main-q70tmm6g.js";
import"../../main-wckvcay0.js";

// src/helpers/set-deployment-status.ts
class SetDeploymentStatus extends HelperInputs {
  state = "";
  environment = "";
}
var setDeploymentStatus = async ({ sha, state, environment, description, target_url, environment_url }) => {
  const { data } = await octokit.repos.listDeployments({
    sha,
    environment,
    ...context.repo
  });
  const deployment_id = data.find(Boolean)?.id;
  if (deployment_id) {
    return octokit.repos.createDeploymentStatus({
      state,
      deployment_id,
      description,
      target_url,
      environment_url,
      ...context.repo
    });
  }
};
export {
  setDeploymentStatus,
  SetDeploymentStatus
};

//# debugId=104F972E2DCF1DFA64756E2164756E21
