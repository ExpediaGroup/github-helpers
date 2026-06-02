import {
  require_bluebird
} from "../main-ttmzs6m5.js";
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

// src/helpers/rerun-pr-checks.ts
var import_bluebird = __toESM(require_bluebird(), 1);
var rerunPrChecks = async () => {
  const {
    data: {
      head: {
        user: { login: owner },
        sha: latestHash,
        ref: branch
      }
    }
  } = await octokit.pulls.get({
    pull_number: context.issue.number,
    ...context.repo
  });
  const workflowRunResponses = await import_bluebird.map(["pull_request", "pull_request_target"], (event) => octokit.actions.listWorkflowRunsForRepo({
    branch,
    ...context.repo,
    owner,
    event,
    per_page: 100,
    status: "completed"
  }));
  const workflowRuns = workflowRunResponses.map((response) => response.data.workflow_runs).flat();
  if (!workflowRuns.length) {
    info(`No workflow runs found on branch ${branch} on ${owner}/${context.repo.repo}`);
    return;
  }
  const latestWorkflowRuns = workflowRuns.filter(({ head_sha }) => head_sha === latestHash);
  info(`There are ${latestWorkflowRuns.length} checks associated with the latest commit, triggering reruns...`);
  return import_bluebird.map(latestWorkflowRuns, async ({ id, name }) => {
    info(`- Rerunning ${name} (${id})`);
    await octokit.actions.reRunWorkflow({ run_id: id, ...context.repo });
  });
};
export {
  rerunPrChecks
};

//# debugId=A747E69D579F71A164756E2164756E21
