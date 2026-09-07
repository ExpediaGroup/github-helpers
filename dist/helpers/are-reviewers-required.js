import {
  info
} from "../main-36vzaw22.js";
import {
  context
} from "../main-agjmamh8.js";
import"../main-5k5kzfdy.js";
import"../main-e3smtmr1.js";
import {
  getRequiredCodeOwnersEntries
} from "../main-vg2yd0f5.js";
import"../main-j9t824v1.js";
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
