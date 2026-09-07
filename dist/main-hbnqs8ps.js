import {
  setFailed
} from "./main-36vzaw22.js";
import {
  octokit
} from "./main-fh8gy58w.js";
import {
  HelperInputs
} from "./main-d5wrnkmf.js";

// src/helpers/get-email-on-user-profile.ts
class GetEmailOnUserProfile2 extends HelperInputs {
  login = "";
}
var getEmailOnUserProfile2 = async ({ login, pattern }) => {
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

export { GetEmailOnUserProfile2, getEmailOnUserProfile2 };

//# debugId=88916BC4BFA2EC5D64756E2164756E21
