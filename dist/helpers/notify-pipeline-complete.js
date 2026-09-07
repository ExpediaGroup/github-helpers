import {
  DEFAULT_PIPELINE_STATUS,
  DEFAULT_PIPELINE_DESCRIPTION,
  PRODUCTION_ENVIRONMENT
} from "../main-jq9kgsp8.js";
import {
  context
} from "../main-agjmamh8.js";
import"../main-5k5kzfdy.js";
import"../main-36vzaw22.js";
import {
  octokit
} from "../main-e3smtmr1.js";
import {
  getMergeQueueCommitHashes
} from "../main-we9k256r.js";
import"../main-9fzkbq68.js";
import {
  require_bluebird
} from "../main-es051p88.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";
import {
  __toESM
} from "../main-syahy8j8.js";

// src/helpers/notify-pipeline-complete.ts
var import_bluebird = __toESM(require_bluebird(), 1);
class NotifyPipelineComplete extends HelperInputs {
}
var notifyPipelineComplete = async ({
  context: context2 = DEFAULT_PIPELINE_STATUS,
  description = DEFAULT_PIPELINE_DESCRIPTION,
  environment = PRODUCTION_ENVIRONMENT,
  target_url,
  merge_queue_enabled
}) => {
  const { data: deployments } = await octokit.repos.listDeployments({
    environment,
    ...context.repo
  });
  const deployment_id = deployments.find(Boolean)?.id;
  if (!deployment_id)
    return;
  await octokit.repos.createDeploymentStatus({
    environment,
    deployment_id,
    state: "success",
    description,
    target_url,
    ...context.repo
  });
  if (merge_queue_enabled === "true") {
    const mergeQueueCommitHashes = await getMergeQueueCommitHashes();
    return import_bluebird.map(mergeQueueCommitHashes, async (sha) => octokit.repos.createCommitStatus({
      sha,
      context: context2,
      state: "success",
      description,
      target_url,
      ...context.repo
    }));
  }
  const { data: pullRequests } = await octokit.pulls.list({
    state: "open",
    per_page: 100,
    ...context.repo
  });
  const commitHashesForOpenPullRequests = pullRequests.map((pullRequest) => pullRequest.head.sha);
  return import_bluebird.map(commitHashesForOpenPullRequests, async (sha) => octokit.repos.createCommitStatus({
    sha,
    context: context2,
    state: "success",
    description,
    target_url,
    ...context.repo
  }));
};
export {
  NotifyPipelineComplete,
  notifyPipelineComplete
};

//# debugId=3D89CC9C798FA26064756E2164756E21
