import {
  context
} from "../main-nnwtk8w8.js";
import"../main-6sabwhac.js";
import {
  info
} from "../main-36vzaw22.js";
import"../main-fh8gy58w.js";
import {
  getCoreMemberLogins
} from "../main-33hyq3fg.js";
import"../main-8fvwf10s.js";
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
