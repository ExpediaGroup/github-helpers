import {
  getRequiredCodeOwnersEntries
} from "../main-fb6evf2x.js";
import"../main-mycz0558.js";
import"../main-pet5htdh.js";
import"../main-ttmzs6m5.js";
import {
  HelperInputs
} from "../main-8h70j5cy.js";
import"../main-4c5nddsb.js";
import {
  context
} from "../main-6avxv4a6.js";
import"../main-9m3k9gt0.js";
import {
  info
} from "../main-q70tmm6g.js";
import"../main-wckvcay0.js";

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
  areReviewersRequired,
  AreReviewersRequired
};

//# debugId=6E227A7F737A4F8364756E2164756E21
