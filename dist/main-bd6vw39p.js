import {
  HelperInputs
} from "./main-8h70j5cy.js";
import {
  octokit
} from "./main-4c5nddsb.js";
import {
  setFailed
} from "./main-q70tmm6g.js";

// src/helpers/get-email-on-user-profile.ts
class GetEmailOnUserProfile extends HelperInputs {
  login = "";
}
var getEmailOnUserProfile = async ({ login, pattern }) => {
  const {
    data: { email }
  } = await octokit.users.getByUsername({ username: login });
  if (!email) {
    setFailed(`User ${login} does not have an email address on their GitHub profile!`);
    return;
  }
  if (pattern && !new RegExp(pattern).test(email)) {
    setFailed(`Email ${email} does not match regex pattern ${pattern}. Please update the email on your GitHub profile to match this pattern!`);
    return;
  }
  return email;
};

export { GetEmailOnUserProfile, getEmailOnUserProfile };

//# debugId=C314A9EBBFCF3E1A64756E2164756E21
