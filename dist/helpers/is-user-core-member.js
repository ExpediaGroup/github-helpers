import {
  getCoreMemberLogins
} from "../main-d5t2z2fg.js";
import"../main-p3eryrkf.js";
import"../main-pet5htdh.js";
import"../main-ttmzs6m5.js";
import {
  HelperInputs
} from "../main-8h70j5cy.js";
import"../main-0559yt64.js";
import {
  context
} from "../main-gex27b9s.js";
import"../main-tntkhvke.js";
import {
  info
} from "../main-ebvxxjzg.js";
import"../main-wckvcay0.js";

// src/helpers/is-user-core-member.ts
class IsUserCoreMember extends HelperInputs {
}
var isUserCoreMember = async ({ pull_number, login = context.actor, codeowners_overrides }) => {
  const pullNumber = Number(pull_number);
  const coreMembers = await getCoreMemberLogins({ pull_number: pullNumber, codeowners_overrides });
  info(`Checking if ${login} is a core member for pull request ${pullNumber}`);
  info(`Core members: ${coreMembers.join(", ")}`);
  return coreMembers.includes(login);
};
export {
  isUserCoreMember,
  IsUserCoreMember
};

//# debugId=69C3812FFA74CCCC64756E2164756E21
