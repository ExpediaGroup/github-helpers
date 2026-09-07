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
  require_bluebird
} from "../main-es051p88.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";
import {
  __toESM
} from "../main-syahy8j8.js";

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
  DeleteDeployment,
  deleteDeployment
};

//# debugId=61DAF0D74EB82D9964756E2164756E21
