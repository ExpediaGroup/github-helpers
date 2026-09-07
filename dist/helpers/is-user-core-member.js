import {
  context
} from "../main-agjmamh8.js";
import"../main-5k5kzfdy.js";
import {
  info
} from "../main-36vzaw22.js";
import"../main-e3smtmr1.js";
import {
  getCoreMemberLogins
} from "../main-vg2yd0f5.js";
import"../main-j9t824v1.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";

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
  IsUserCoreMember,
  isUserCoreMember
};

//# debugId=56115FFF33C3BAA764756E2164756E21
