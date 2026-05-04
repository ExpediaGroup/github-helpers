import {
  isUserInTeam
} from "./main-f57sjs6g.js";
import {
  removeLabelIfExists
} from "./main-fk67p72v.js";
import {
  setCommitStatus
} from "./main-3vz73ekb.js";
import {
  paginateAllOpenPullRequests
} from "./main-zd3p3dtn.js";
import {
  approvalsSatisfied
} from "./main-bbwgztca.js";
import {
  createPrComment
} from "./main-5k5vz4h5.js";
import {
  notifyUser
} from "./main-9vvnm9ey.js";
import {
  getEmailOnUserProfile
} from "./main-bd6vw39p.js";
import {
  FIRST_QUEUED_PR_LABEL,
  JUMP_THE_QUEUE_PR_LABEL,
  MERGE_QUEUE_STATUS,
  QUEUED_FOR_MERGE_PREFIX,
  READY_FOR_MERGE_PR_LABEL
} from "./main-9c2herm2.js";
import {
  require_bluebird
} from "./main-ttmzs6m5.js";
import {
  HelperInputs
} from "./main-8h70j5cy.js";
import {
  octokit,
  octokitGraphql
} from "./main-4c5nddsb.js";
import {
  context
} from "./main-6avxv4a6.js";
import {
  getInput,
  info,
  setFailed,
  warning
} from "./main-q70tmm6g.js";
import {
  __toESM
} from "./main-wckvcay0.js";

// src/utils/update-merge-queue.ts
var import_bluebird = __toESM(require_bluebird(), 1);
var updateMergeQueue = (queuedPrs) => {
  const sortedPrs = sortPrsByQueuePosition(queuedPrs);
  return import_bluebird.map(sortedPrs, updateQueuePosition);
};
var sortPrsByQueuePosition = (queuedPrs) => queuedPrs.map((pr) => {
  const label = pr.labels.find((label2) => label2.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
  const hasJumpTheQueueLabel = Boolean(pr.labels.find((label2) => label2.name === JUMP_THE_QUEUE_PR_LABEL));
  const queuePosition = Number(label?.split("#")?.[1]);
  return {
    number: pr.number,
    label,
    hasJumpTheQueueLabel,
    queuePosition,
    sha: pr.head.sha
  };
}).sort((pr1, pr2) => {
  if (pr1.hasJumpTheQueueLabel) {
    return -1;
  }
  if (pr2.hasJumpTheQueueLabel) {
    return 1;
  }
  return pr1.queuePosition - pr2.queuePosition;
});
var updateQueuePosition = async (pr, index) => {
  const { number, label, queuePosition, sha, hasJumpTheQueueLabel } = pr;
  const newQueuePosition = index + 1;
  if (!label || isNaN(queuePosition) || queuePosition === newQueuePosition) {
    return;
  }
  if (hasJumpTheQueueLabel) {
    await removeLabelIfExists(JUMP_THE_QUEUE_PR_LABEL, number);
  }
  const prIsNowFirstInQueue = newQueuePosition === 1;
  if (prIsNowFirstInQueue) {
    const { data: firstPrInQueue } = await octokit.pulls.get({ pull_number: number, ...context.repo });
    await updatePrWithDefaultBranch(firstPrInQueue);
    const {
      data: {
        head: { sha: updatedHeadSha }
      }
    } = await octokit.pulls.get({ pull_number: number, ...context.repo });
    return Promise.all([
      octokit.issues.addLabels({
        labels: [`${QUEUED_FOR_MERGE_PREFIX} #${newQueuePosition}`],
        issue_number: number,
        ...context.repo
      }),
      removeLabelIfExists(label, number),
      setCommitStatus({
        sha: updatedHeadSha,
        context: MERGE_QUEUE_STATUS,
        state: "success",
        description: "This PR is next to merge."
      })
    ]);
  }
  return Promise.all([
    octokit.issues.addLabels({
      labels: [`${QUEUED_FOR_MERGE_PREFIX} #${newQueuePosition}`],
      issue_number: number,
      ...context.repo
    }),
    removeLabelIfExists(label, number),
    setCommitStatus({
      sha,
      context: MERGE_QUEUE_STATUS,
      state: "pending",
      description: "This PR is in line to merge."
    })
  ]);
};

// src/helpers/manage-merge-queue.ts
class ManageMergeQueue extends HelperInputs {
}
var manageMergeQueue = async ({
  max_queue_size,
  login,
  slack_webhook_url,
  skip_auto_merge,
  team = "",
  allow_only_for_maintainers,
  pattern
} = {}) => {
  warning("manage-merge-queue is deprecated. Please use GitHub's native merge queue: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue");
  const { data: pullRequest } = await octokit.pulls.get({ pull_number: context.issue.number, ...context.repo });
  if (pullRequest.merged || !pullRequest.labels.find((label) => label.name === READY_FOR_MERGE_PR_LABEL)) {
    info("This PR is not in the merge queue.");
    return removePrFromQueue(pullRequest);
  }
  const prMeetsRequiredApprovals = await approvalsSatisfied({
    body: "PRs must meet all required approvals before entering the merge queue."
  });
  if (!prMeetsRequiredApprovals) {
    return removePrFromQueue(pullRequest);
  }
  if (slack_webhook_url && login) {
    const email = await getEmailOnUserProfile({ login, pattern });
    if (!email) {
      const patternText = pattern ? `, and it must match the regex pattern \`${pattern}\`` : "";
      await createPrComment({
        body: `@${login} Your PR cannot be added to the queue because your email must be set on your GitHub profile${patternText}. Follow the instructions [here](${githubEmailDocsLink}) to add or fix your email on ${context.serverUrl}!`
      });
      return removePrFromQueue(pullRequest);
    }
  }
  const queuedPrs = await getQueuedPullRequests();
  const queuePosition = queuedPrs.length + 1;
  const prAttemptingToJoinQueue = pullRequest.labels.every((label) => !label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX));
  if (prAttemptingToJoinQueue && queuePosition > Number(max_queue_size)) {
    await createPrComment({
      body: `The merge queue is full! Only ${max_queue_size} PRs are allowed in the queue at a time.

If you would like to merge your PR, please monitor the PRs in the queue and make sure the authors are around to merge them.`
    });
    return removePrFromQueue(pullRequest);
  }
  if (pullRequest.labels.find((label) => label.name === JUMP_THE_QUEUE_PR_LABEL)) {
    if (allow_only_for_maintainers === "true") {
      info(`Checking if user ${login} is a maintainer...`);
      const isMaintainer = await isUserInTeam({ login: context.actor, team });
      if (!isMaintainer) {
        await removeLabelIfExists(JUMP_THE_QUEUE_PR_LABEL, pullRequest.number);
        return await createPrComment({
          body: `@${context.actor} Only core maintainers can jump the queue. Please have a core maintainer jump the queue for you.`
        });
      }
    }
    return updateMergeQueue(queuedPrs);
  }
  if (prAttemptingToJoinQueue) {
    await addPrToQueue(pullRequest, queuePosition, skip_auto_merge);
  }
  const isFirstQueuePosition = queuePosition === 1 || pullRequest.labels.find((label) => label.name === FIRST_QUEUED_PR_LABEL);
  if (isFirstQueuePosition) {
    await updatePrWithDefaultBranch(pullRequest);
  }
  await setCommitStatus({
    sha: pullRequest.head.sha,
    context: MERGE_QUEUE_STATUS,
    state: isFirstQueuePosition ? "success" : "pending",
    description: isFirstQueuePosition ? "This PR is next to merge." : "This PR is in line to merge."
  });
  if (isFirstQueuePosition && slack_webhook_url && login) {
    await notifyUser({
      login,
      pull_number: context.issue.number,
      slack_webhook_url
    });
  }
};
var removePrFromQueue = async (pullRequest) => {
  await removeLabelIfExists(READY_FOR_MERGE_PR_LABEL, pullRequest.number);
  const queueLabel = pullRequest.labels.find((label) => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
  if (queueLabel) {
    await removeLabelIfExists(queueLabel, pullRequest.number);
  }
  await setCommitStatus({
    sha: pullRequest.head.sha,
    context: MERGE_QUEUE_STATUS,
    state: "pending",
    description: "This PR is not in the merge queue."
  });
  const queuedPrs = await getQueuedPullRequests();
  return updateMergeQueue(queuedPrs);
};
var addPrToQueue = async (pullRequest, queuePosition, skip_auto_merge) => {
  await octokit.issues.addLabels({
    labels: [`${QUEUED_FOR_MERGE_PREFIX} #${queuePosition}`],
    issue_number: context.issue.number,
    ...context.repo
  });
  if (skip_auto_merge == "true") {
    info("Skipping auto merge per configuration.");
    return;
  }
  await enableAutoMerge(pullRequest.node_id);
};
var getQueuedPullRequests = async () => {
  const openPullRequests = await paginateAllOpenPullRequests();
  return openPullRequests.filter((pr) => pr.labels.some((label) => label.name === READY_FOR_MERGE_PR_LABEL) && pr.labels.some((label) => label.name.startsWith(QUEUED_FOR_MERGE_PREFIX)));
};
var enableAutoMerge = async (pullRequestId, mergeMethod = "SQUASH") => {
  try {
    await octokitGraphql(`
    mutation {
      enablePullRequestAutoMerge(input: { pullRequestId: "${pullRequestId}", mergeMethod: ${mergeMethod} }) {
        clientMutationId
      }
    }
  `);
  } catch (error) {
    warning("Auto merge could not be enabled. Perhaps you need to enable auto-merge on your repo?");
    warning(error);
  }
};
var githubEmailDocsLink = "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/changing-your-primary-email-address";

// src/helpers/prepare-queued-pr-for-merge.ts
var prepareQueuedPrForMerge = async () => {
  const { data } = await octokit.pulls.list({
    state: "open",
    per_page: 100,
    ...context.repo
  });
  const pullRequest = findNextPrToMerge(data);
  if (pullRequest) {
    return updatePrWithDefaultBranch(pullRequest);
  }
};
var findNextPrToMerge = (pullRequests) => pullRequests.find((pr) => hasRequiredLabels(pr, [READY_FOR_MERGE_PR_LABEL, JUMP_THE_QUEUE_PR_LABEL])) ?? pullRequests.find((pr) => hasRequiredLabels(pr, [READY_FOR_MERGE_PR_LABEL, FIRST_QUEUED_PR_LABEL]));
var hasRequiredLabels = (pr, requiredLabels) => requiredLabels.every((mergeQueueLabel) => pr.labels.some((label) => label.name === mergeQueueLabel));
var updatePrWithDefaultBranch = async (pullRequest) => {
  if (pullRequest.head.user?.login && pullRequest.base.user?.login && pullRequest.head.user?.login !== pullRequest.base.user?.login) {
    try {
      await octokit.repos.mergeUpstream({
        ...context.repo,
        branch: pullRequest.base.repo.default_branch
      });
    } catch (error) {
      if (error.status === 409) {
        setFailed("Attempt to update fork branch with upstream failed; conflict on default branch between fork and upstream.");
      } else
        setFailed(error.message);
    }
  }
  try {
    await octokit.repos.merge({
      base: pullRequest.head.ref,
      head: "HEAD",
      ...context.repo
    });
  } catch (error) {
    const noEvictUponConflict = getInput("no_evict_upon_conflict");
    const githubError = error;
    if (githubError.status !== 409) {
      setFailed(githubError.message);
      return;
    }
    if (noEvictUponConflict === "true") {
      info("The first PR in the queue has a merge conflict. PR was not removed from the queue due to no_evict_upon_conflict input.");
      return;
    }
    await removePrFromQueue(pullRequest);
    setFailed("The first PR in the queue has a merge conflict, and it was removed from the queue.");
  }
};

export { prepareQueuedPrForMerge, updatePrWithDefaultBranch, ManageMergeQueue, manageMergeQueue, removePrFromQueue, enableAutoMerge };

//# debugId=37FACE3969ED272964756E2164756E21
