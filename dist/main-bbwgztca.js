import {
  createPrComment
} from "./main-5k5vz4h5.js";
import {
  getRequiredCodeOwnersEntries,
  paginateMembersInOrg
} from "./main-fb6evf2x.js";
import {
  require_lodash
} from "./main-pet5htdh.js";
import {
  require_bluebird
} from "./main-ttmzs6m5.js";
import {
  HelperInputs
} from "./main-8h70j5cy.js";
import {
  octokit
} from "./main-4c5nddsb.js";
import {
  context
} from "./main-6avxv4a6.js";
import {
  info,
  setFailed
} from "./main-q70tmm6g.js";
import {
  __toESM
} from "./main-wckvcay0.js";

// src/helpers/approvals-satisfied.ts
var import_bluebird = __toESM(require_bluebird(), 1);

// src/utils/paginate-all-reviews.ts
var paginateAllReviews = async (prNumber, page = 1) => {
  const response = await octokit.pulls.listReviews({
    pull_number: prNumber,
    per_page: 100,
    page,
    ...context.repo
  });
  if (!response.data.length) {
    return [];
  }
  return response.data.concat(await paginateAllReviews(prNumber, page + 1));
};

// src/helpers/approvals-satisfied.ts
var import_lodash = __toESM(require_lodash(), 1);
class ApprovalsSatisfied extends HelperInputs {
}
var approvalsSatisfied = async ({
  teams,
  users,
  codeowners_overrides,
  number_of_reviewers = "1",
  required_review_overrides,
  pull_number,
  body
} = {}) => {
  const prNumber = pull_number ? Number(pull_number) : context.issue.number;
  const teamOverrides = required_review_overrides?.split(",").map((overrideString) => {
    const [team, numberOfRequiredReviews] = overrideString.split(":");
    return { team, numberOfRequiredReviews };
  });
  const teamsList = updateTeamsList(teams?.split(/[\n,]/).map((t) => t.trim()));
  if (!validateTeamsList(teamsList)) {
    setFailed('If teams input is in the format "org/team", then the org must be the same as the repository org');
    return false;
  }
  const usersList = users?.split(/[\n,]/).map((u) => u.replaceAll("@", "").trim());
  const logs = [];
  const reviews = await paginateAllReviews(prNumber);
  const approverLogins = reviews.filter(({ state }) => state === "APPROVED").map(({ user }) => user?.login).filter(Boolean);
  logs.push(`PR already approved by: ${approverLogins.map((login) => `\`${login}\``).join(", ")}`);
  const requiredCodeOwnersEntries = teamsList || usersList ? createArtificialCodeOwnersEntry({ teams: teamsList, users: usersList }) : await getRequiredCodeOwnersEntries(prNumber, codeowners_overrides);
  const requiredCodeOwnersEntriesWithOwners = import_lodash.uniqBy(requiredCodeOwnersEntries.filter(({ owners }) => owners.length), "owners");
  const codeOwnersEntrySatisfiesApprovals = async (entry) => {
    const loginsLists = await import_bluebird.map(entry.owners, async (teamOrUsers) => {
      if (isTeam(teamOrUsers)) {
        const members = await paginateMembersInOrg(teamOrUsers);
        return members.map(({ login }) => login);
      } else {
        return teamOrUsers.replaceAll("@", "").split(",");
      }
    });
    const codeOwnerLogins = import_lodash.uniq(loginsLists.flat());
    const numberOfApprovals = approverLogins.filter((login) => codeOwnerLogins.includes(login)).length;
    const numberOfRequiredReviews = teamOverrides?.find(({ team }) => team && entry.owners.includes(team))?.numberOfRequiredReviews ?? number_of_reviewers;
    logs.push(`Current number of approvals satisfied for ${entry.owners.map((o) => `\`${o.replaceAll("@", "")}\``).join(",")}: ${numberOfApprovals}`);
    logs.push(`Number of required reviews: ${numberOfRequiredReviews}`);
    return numberOfApprovals >= Number(numberOfRequiredReviews);
  };
  if (requiredCodeOwnersEntriesWithOwners.length) {
    logs.push(`Required code owners: ${requiredCodeOwnersEntriesWithOwners.flatMap(({ owners }) => owners.map((o) => o.replaceAll("@", ""))).map((o) => `\`${o}\``).join(", ")}`);
  }
  const booleans = await Promise.all(requiredCodeOwnersEntriesWithOwners.map(codeOwnersEntrySatisfiesApprovals));
  const approvalsSatisfied2 = booleans.every(Boolean);
  if (!approvalsSatisfied2) {
    logs.unshift(`Required approvals not satisfied:
`);
    if (body) {
      logs.unshift(body + `
`);
      await createPrComment({
        pull_number,
        body: logs.join(`
`)
      });
    }
  }
  info(logs.join(`
`));
  return approvalsSatisfied2;
};
var createArtificialCodeOwnersEntry = ({ teams = [], users = [] }) => [
  { owners: teams.concat(users) }
];
var isTeam = (teamOrUsers) => teamOrUsers.includes("/");
var updateTeamsList = (teamsList) => {
  return teamsList?.map((team) => {
    if (!team.includes("/")) {
      return `${context.repo.owner}/${team}`;
    } else {
      return team;
    }
  });
};
var validateTeamsList = (teamsList) => {
  return teamsList?.every((team) => {
    const inputOrg = team.split("/")[0];
    return inputOrg === context.repo.owner;
  }) ?? true;
};

export { ApprovalsSatisfied, approvalsSatisfied };

//# debugId=B9169412AC460F1A64756E2164756E21
