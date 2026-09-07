import {
  DEFAULT_PIPELINE_STATUS
} from "../main-jq9kgsp8.js";
import {
  context
} from "../main-nnwtk8w8.js";
import"../main-6sabwhac.js";
import"../main-36vzaw22.js";
import {
  octokit
} from "../main-fh8gy58w.js";
import {
  getMergeQueueCommitHashes
} from "../main-g4wfn82f.js";
import"../main-00tcd9f5.js";
import {
  require_bluebird
} from "../main-es051p88.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";
import {
  __toESM
} from "../main-syahy8j8.js";

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
    return import_bluebird.map(mergeQueueCommitHashes, async (sha) => octokit.repos.createCommitStatus({
      sha,
      context: context2,
      state: "pending",
      description,
      target_url,
      ...context.repo
    }));
  }
};
export {
  InitiateDeployment,
  initiateDeployment
};

//# debugId=202D8C8651E7297864756E2164756E21
