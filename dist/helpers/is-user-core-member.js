import {
  getCoreMemberLogins
} from "../main-my53cvfm.js";
import"../main-43jh1fmn.js";
import"../main-pet5htdh.js";
import"../main-ttmzs6m5.js";
import {
  HelperInputs
} from "../main-8h70j5cy.js";
import"../main-4tezksf5.js";
import {
  context
} from "../main-byv6ddq4.js";
import"../main-9m3k9gt0.js";
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
