import {
  getInput,
  setFailed,
  warning,
  info
} from "./main-36vzaw22.js";
import {
  READY_FOR_MERGE_PR_LABEL,
  MERGE_QUEUE_STATUS,
  QUEUED_FOR_MERGE_PREFIX,
  FIRST_QUEUED_PR_LABEL,
  JUMP_THE_QUEUE_PR_LABEL
} from "./main-jq9kgsp8.js";
import {
  context
} from "./main-nnwtk8w8.js";
import {
  octokit,
  octokitGraphql
} from "./main-fh8gy58w.js";
import {
  notifyUser
} from "./main-c2rt2anc.js";
import {
  getEmailOnUserProfile2
} from "./main-hbnqs8ps.js";
import {
  removeLabelIfExists2
} from "./main-b3a18pad.js";
import {
  setCommitStatus2
} from "./main-en73eexx.js";
import {
  createPrComment2
} from "./main-hwzwrqja.js";
import {
  approvalsSatisfied2
} from "./main-xtctj82v.js";
import {
  isUserInTeam2
} from "./main-d50gcstv.js";
import {
  paginateAllOpenPullRequests
} from "./main-j2vhxcaz.js";
import {
  require_bluebird
} from "./main-es051p88.js";
import {
  HelperInputs
} from "./main-d5wrnkmf.js";
import {
  __toESM
} from "./main-syahy8j8.js";

// src/utils/update-merge-queue.ts
var import_bluebird = __toESM(require_bluebird(), 1);
var updateMergeQueue = (queuedPrs) => {
  const sortedPrs = sortPrsByQueuePosition(queuedPrs);
  return import_bluebird.map(sortedPrs, updateQueuePosition);
};
var sortPrsByQueuePosition = (queuedPrs) => queuedPrs.map((pr) => {
  const label = pr.labels.find((label) => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
  const hasJumpTheQueueLabel = Boolean(pr.labels.find((label) => label.name === JUMP_THE_QUEUE_PR_LABEL));
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
    await removeLabelIfExists2(JUMP_THE_QUEUE_PR_LABEL, number);
  }
  const prIsNowFirstInQueue = newQueuePosition === 1;
  if (prIsNowFirstInQueue) {
    const { data: firstPrInQueue } = await octokit.pulls.get({ pull_number: number, ...context.repo });
    await updatePrWithDefaultBranch2(firstPrInQueue);
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
      removeLabelIfExists2(label, number),
      setCommitStatus2({
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
    removeLabelIfExists2(label, number),
    setCommitStatus2({
      sha,
      context: MERGE_QUEUE_STATUS,
      state: "pending",
      description: "This PR is in line to merge."
    })
  ]);
};

// src/helpers/manage-merge-queue.ts
class ManageMergeQueue2 extends HelperInputs {
}
var manageMergeQueue2 = async ({
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
    return removePrFromQueue2(pullRequest);
  }
  const prMeetsRequiredApprovals = await approvalsSatisfied2({
    body: "PRs must meet all required approvals before entering the merge queue."
  });
  if (!prMeetsRequiredApprovals) {
    return removePrFromQueue2(pullRequest);
  }
  if (slack_webhook_url && login) {
    const email = await getEmailOnUserProfile2({ login, pattern });
    if (!email) {
      const patternText = pattern ? `, and it must match the regex pattern \`${pattern}\`` : "";
      await createPrComment2({
        body: `@${login} Your PR cannot be added to the queue because your email must be set on your GitHub profile${patternText}. Follow the instructions [here](${githubEmailDocsLink}) to add or fix your email on ${context.serverUrl}!`
      });
      return removePrFromQueue2(pullRequest);
    }
  }
  const queuedPrs = await getQueuedPullRequests();
  const queuePosition = queuedPrs.length + 1;
  const prAttemptingToJoinQueue = pullRequest.labels.every((label) => !label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX));
  if (prAttemptingToJoinQueue && queuePosition > Number(max_queue_size)) {
    await createPrComment2({
      body: `The merge queue is full! Only ${max_queue_size} PRs are allowed in the queue at a time.

If you would like to merge your PR, please monitor the PRs in the queue and make sure the authors are around to merge them.`
    });
    return removePrFromQueue2(pullRequest);
  }
  if (pullRequest.labels.find((label) => label.name === JUMP_THE_QUEUE_PR_LABEL)) {
    if (allow_only_for_maintainers === "true") {
      info(`Checking if user ${login} is a maintainer...`);
      const isMaintainer = await isUserInTeam2({ login: context.actor, team });
      if (!isMaintainer) {
        await removeLabelIfExists2(JUMP_THE_QUEUE_PR_LABEL, pullRequest.number);
        return await createPrComment2({
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
    await updatePrWithDefaultBranch2(pullRequest);
  }
  await setCommitStatus2({
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
var removePrFromQueue2 = async (pullRequest) => {
  await removeLabelIfExists2(READY_FOR_MERGE_PR_LABEL, pullRequest.number);
  const queueLabel = pullRequest.labels.find((label) => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
  if (queueLabel) {
    await removeLabelIfExists2(queueLabel, pullRequest.number);
  }
  await setCommitStatus2({
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
  await enableAutoMerge2(pullRequest.node_id);
};
var getQueuedPullRequests = async () => {
  const openPullRequests = await paginateAllOpenPullRequests();
  return openPullRequests.filter((pr) => pr.labels.some((label) => label.name === READY_FOR_MERGE_PR_LABEL) && pr.labels.some((label) => label.name.startsWith(QUEUED_FOR_MERGE_PREFIX)));
};
var enableAutoMerge2 = async (pullRequestId, mergeMethod = "SQUASH") => {
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
var prepareQueuedPrForMerge2 = async () => {
  const { data } = await octokit.pulls.list({
    state: "open",
    per_page: 100,
    ...context.repo
  });
  const pullRequest = findNextPrToMerge(data);
  if (pullRequest) {
    return updatePrWithDefaultBranch2(pullRequest);
  }
};
var findNextPrToMerge = (pullRequests) => pullRequests.find((pr) => hasRequiredLabels(pr, [READY_FOR_MERGE_PR_LABEL, JUMP_THE_QUEUE_PR_LABEL])) ?? pullRequests.find((pr) => hasRequiredLabels(pr, [READY_FOR_MERGE_PR_LABEL, FIRST_QUEUED_PR_LABEL]));
var hasRequiredLabels = (pr, requiredLabels) => requiredLabels.every((mergeQueueLabel) => pr.labels.some((label) => label.name === mergeQueueLabel));
var updatePrWithDefaultBranch2 = async (pullRequest) => {
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
    await removePrFromQueue2(pullRequest);
    setFailed("The first PR in the queue has a merge conflict, and it was removed from the queue.");
  }
};

export { prepareQueuedPrForMerge2, updatePrWithDefaultBranch2, ManageMergeQueue2, manageMergeQueue2, removePrFromQueue2, enableAutoMerge2 };

//# debugId=702EA2B1F781866B64756E2164756E21
