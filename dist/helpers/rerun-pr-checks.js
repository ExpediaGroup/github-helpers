import {
  info
} from "../main-36vzaw22.js";
import {
  context
} from "../main-nnwtk8w8.js";
import"../main-6sabwhac.js";
import {
  octokit
} from "../main-fh8gy58w.js";
import {
  require_bluebird
} from "../main-es051p88.js";
import {
  __toESM
} from "../main-syahy8j8.js";

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

//# debugId=B1D3A6DA86B8104A64756E2164756E21
