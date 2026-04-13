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
} from "../main-6avxv4a6.js";
import"../main-9m3k9gt0.js";
import {
  info
} from "../main-q70tmm6g.js";
import {
  __toESM
} from "../main-wckvcay0.js";

// src/helpers/delete-deployment.ts
var import_bluebird = __toESM(require_bluebird(), 1);
var DEFAULT_MAP_CONCURRENCY = 5;

class DeleteDeploymentResponse {
  deploymentsDeleted = 0;
  deploymentsFound = 0;
  message = "";
  environmentDeleted = false;
  constructor(init) {
    Object.assign(this, init);
  }
}

class DeleteDeployment extends HelperInputs {
  environment = "";
}
var deactivateDeployments = async (deployments) => {
  const statusResponse = await import_bluebird.map(deployments, async (deploymentId) => {
    return octokit.repos.createDeploymentStatus({
      state: "inactive",
      deployment_id: deploymentId,
      ...context.repo
    });
  }, { concurrency: DEFAULT_MAP_CONCURRENCY });
  const deletionMatch = statusResponse.filter((result) => result.data.state === "success").length === deployments.length;
  if (!deletionMatch) {
    info(`Not all deployments were successfully deactivated. Some may still be active.`);
  }
};
var deleteDeployments = async (deployments) => {
  return await import_bluebird.map(deployments, async (deploymentId) => {
    return octokit.repos.deleteDeployment({
      deployment_id: deploymentId,
      ...context.repo
    });
  }, { concurrency: DEFAULT_MAP_CONCURRENCY });
};
var deleteDeployment = async ({ sha, environment }) => {
  const { data } = await octokit.repos.listDeployments({
    sha,
    environment,
    ...context.repo
  });
  if (!data.length) {
    return new DeleteDeploymentResponse({
      message: `No deployments found for environment ${environment}`
    });
  }
  const deployments = data.map((deployment) => deployment.id);
  await deactivateDeployments(deployments);
  const reqResults = await deleteDeployments(deployments);
  const envDelResult = await octokit.repos.deleteAnEnvironment({
    environment_name: environment,
    ...context.repo
  }).catch(() => null);
  const deploymentsDeleted = reqResults.filter((result) => result.status === 204).length;
  const environmentDeleted = envDelResult?.status === 204;
  return new DeleteDeploymentResponse({
    deploymentsDeleted,
    deploymentsFound: data.length,
    environmentDeleted,
    message: `Deleted ${deploymentsDeleted} deployments for environment ${environment}`
  });
};
export {
  deleteDeployment,
  DeleteDeployment
};

//# debugId=970C57FDD85677D364756E2164756E21
