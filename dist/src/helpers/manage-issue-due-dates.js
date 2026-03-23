import {
  removeLabelIfExists
} from "../../main-gea228qs.js";
import {
  ALMOST_OVERDUE_ISSUE,
  OVERDUE_ISSUE,
  PRIORITY_LABELS,
  PRIORITY_TO_DAYS_MAP,
  SECONDS_IN_A_DAY
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

// src/utils/paginate-prioritized-issues.ts
var import_bluebird = __toESM(require_bluebird(), 1);
var paginateAllPrioritizedIssues = async () => (await import_bluebird.map(PRIORITY_LABELS, async (label) => await paginateIssuesOfSpecificPriority(label))).flat();
var paginateIssuesOfSpecificPriority = async (label, page = 1) => {
  const response = await octokit.issues.listForRepo({
    state: "open",
    sort: "created",
    direction: "desc",
    per_page: 100,
    labels: label,
    page,
    ...context.repo
  });
  if (!response?.data?.length) {
    return [];
  }
  return response.data.concat(await paginateIssuesOfSpecificPriority(label, page + 1));
};

// src/utils/paginate-comments-on-issue.ts
var paginateAllCommentsOnIssue = async (issue_number, page = 1) => {
  const response = await octokit.issues.listComments({
    issue_number,
    sort: "created",
    direction: "desc",
    per_page: 100,
    page,
    ...context.repo
  });
  if (!response?.data?.length) {
    return [];
  }
  return response.data.concat(await paginateAllCommentsOnIssue(issue_number, page + 1));
};

// src/utils/add-due-date-comment.ts
var addDueDateComment = async (deadline, createdDate, issue_number) => {
  const commentList = await paginateAllCommentsOnIssue(issue_number);
  if (!commentList?.find((comment) => comment.body?.startsWith("This issue is due on"))) {
    const dueDate = new Date(createdDate.getTime() + deadline * SECONDS_IN_A_DAY);
    await octokit.issues.createComment({
      issue_number,
      body: `This issue is due on ${dueDate.toDateString()}`,
      ...context.repo
    });
  }
};
var pingAssigneesForDueDate = async (assignees, labelToAdd, issue_number) => {
  const commentList = await paginateAllCommentsOnIssue(issue_number);
  assignees?.map(async (assignee) => {
    const commentToAdd = `@${assignee.name || assignee.login}, this issue assigned to you is now ${labelToAdd.toLowerCase()}`;
    if (!commentList?.find((comment) => comment.body === commentToAdd)) {
      await octokit.issues.createComment({
        issue_number,
        body: commentToAdd,
        ...context.repo
      });
    }
  });
};

// src/helpers/manage-issue-due-dates.ts
var import_bluebird2 = __toESM(require_bluebird(), 1);
class ManageIssueDueDates extends HelperInputs {
}
var manageIssueDueDates = async ({ days = "7" }) => {
  const openIssues = await paginateAllPrioritizedIssues();
  const warningThreshold = Number(days);
  const getFirstPriorityLabelFoundOnIssue = (issueLabels) => PRIORITY_LABELS.find((priorityLabel) => issueLabels.some((issueLabel) => {
    const labelName = typeof issueLabel === "string" ? issueLabel : issueLabel.name;
    return labelName === priorityLabel;
  }));
  await import_bluebird2.map(openIssues, async (issue) => {
    const { labels, created_at, assignees, number: issue_number } = issue;
    const priority = getFirstPriorityLabelFoundOnIssue(labels);
    const alreadyHasOverdueLabel = Boolean(labels.find((label) => {
      const overdueLabels = [OVERDUE_ISSUE];
      const labelName = typeof label === "string" ? label : label.name || "";
      return overdueLabels.includes(labelName);
    }));
    if (!priority || alreadyHasOverdueLabel) {
      return;
    }
    const createdDate = new Date(created_at);
    const daysSinceCreation = Math.ceil((Date.now() - createdDate.getTime()) / SECONDS_IN_A_DAY);
    const deadline = PRIORITY_TO_DAYS_MAP[priority];
    await addDueDateComment(deadline, createdDate, issue_number);
    const labelToAdd = daysSinceCreation > deadline ? OVERDUE_ISSUE : daysSinceCreation > deadline - warningThreshold ? ALMOST_OVERDUE_ISSUE : undefined;
    if (labelToAdd) {
      if (assignees) {
        await pingAssigneesForDueDate(assignees, labelToAdd, issue_number);
      }
      if (labelToAdd === OVERDUE_ISSUE) {
        await removeLabelIfExists(ALMOST_OVERDUE_ISSUE, issue_number);
      }
      await octokit.issues.addLabels({
        labels: [labelToAdd],
        issue_number,
        ...context.repo
      });
    }
  });
};
export {
  manageIssueDueDates,
  ManageIssueDueDates
};

//# debugId=D92320313AE4171864756E2164756E21
