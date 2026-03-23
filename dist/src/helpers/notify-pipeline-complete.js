import {
  getMergeQueueCommitHashes
} from "../../main-9ty9m4xy.js";
import"../../main-ke778w9b.js";
import {
  DEFAULT_PIPELINE_DESCRIPTION,
  DEFAULT_PIPELINE_STATUS,
  PRODUCTION_ENVIRONMENT
} from "../../main-9c2herm2.js";
import {
  require_bluebird
} from "../../main-ttmzs6m5.js";
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
import {
  __toESM
} from "../../main-wckvcay0.js";

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
  notifyPipelineComplete,
  NotifyPipelineComplete
};

//# debugId=4548E9BAB3D1427964756E2164756E21
