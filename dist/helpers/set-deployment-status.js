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
  SetDeploymentStatus,
  setDeploymentStatus
};

//# debugId=0AB7AADF03E1269C64756E2164756E21
