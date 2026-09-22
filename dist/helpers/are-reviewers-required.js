import {
  info
} from "../main-36vzaw22.js";
import {
  context
} from "../main-nnwtk8w8.js";
import"../main-6sabwhac.js";
import"../main-fh8gy58w.js";
import {
  getRequiredCodeOwnersEntries
} from "../main-33hyq3fg.js";
import"../main-8fvwf10s.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";

// src/helpers/are-reviewers-required.ts
class AreReviewersRequired extends HelperInputs {
  teams = "";
}
var areReviewersRequired = async ({ teams }) => {
  const prNumber = context.issue.number;
  const teamsList = teams?.split(`
`);
  const requiredCodeOwnersEntries = (await getRequiredCodeOwnersEntries(prNumber)).map(({ owners }) => owners).flat();
  const notRequiredTeams = teamsList.filter((team) => !requiredCodeOwnersEntries.includes(team));
  if (notRequiredTeams.length) {
    info(`${notRequiredTeams.join(", ")} not in list of required reviewers (${requiredCodeOwnersEntries.join(", ")})`);
    return false;
  }
  return true;
};
export {
  AreReviewersRequired,
  areReviewersRequired
};

//# debugId=B51FFD8171257BBC64756E2164756E21
