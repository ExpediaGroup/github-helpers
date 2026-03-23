import {
  getMergeQueueCommitHashes
} from "../main-9ty9m4xy.js";
import"../main-ke778w9b.js";
import {
  DEFAULT_PIPELINE_STATUS
} from "../main-9c2herm2.js";
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
} from "../main-p94abnca.js";
import"../main-9m3k9gt0.js";
import"../main-q70tmm6g.js";
import {
  __toESM
} from "../main-wckvcay0.js";

// src/helpers/initiate-deployment.ts
var import_bluebird = __toESM(require_bluebird(), 1);

class InitiateDeployment extends HelperInputs {
  sha = "";
  environment = "";
}
var initiateDeployment = async ({
  sha,
  state = "in_progress",
  environment,
  environment_url,
  description,
  target_url,
  context: context2 = DEFAULT_PIPELINE_STATUS,
  merge_queue_enabled
}) => {
  const { data } = await octokit.repos.createDeployment({
    ref: sha,
    environment,
    auto_merge: false,
    required_contexts: [],
    ...context.repo
  });
  const deployment_id = "ref" in data ? data.id : undefined;
  if (!deployment_id)
    return;
  await octokit.repos.createDeploymentStatus({
    state,
    deployment_id,
    description,
    environment_url,
    target_url,
    ...context.repo
  });
  if (merge_queue_enabled === "true") {
    const mergeQueueCommitHashes = await getMergeQueueCommitHashes();
    return import_bluebird.map(mergeQueueCommitHashes, async (sha2) => octokit.repos.createCommitStatus({
      sha: sha2,
      context: context2,
      state: "pending",
      description,
      target_url,
      ...context.repo
    }));
  }
};
export {
  initiateDeployment,
  InitiateDeployment
};

//# debugId=79829AEA9D0F2D7164756E2164756E21
