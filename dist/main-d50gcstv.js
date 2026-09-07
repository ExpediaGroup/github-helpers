import {
  context
} from "./main-nnwtk8w8.js";
import {
  info
} from "./main-36vzaw22.js";
import {
  octokit
} from "./main-fh8gy58w.js";
import {
  HelperInputs
} from "./main-d5wrnkmf.js";

// src/helpers/is-user-in-team.ts
class IsUserInTeam2 extends HelperInputs {
  team = "";
}
var isUserInTeam2 = async ({ login = context.actor, team }) => {
  const members = await paginateAllMembersInOrg(team);
  info(`Checking if ${login} is in team ${team}`);
  info(`Team members: ${members.map(({ login }) => login).join(", ")}`);
  return members.some(({ login: memberLogin }) => memberLogin === login);
};
async function paginateAllMembersInOrg(team, page = 1) {
  const response = await octokit.teams.listMembersInOrg({
    org: context.repo.owner,
    team_slug: team,
    page,
    per_page: 100
  });
  if (!response.data.length) {
    return [];
  }
  return response.data.concat(await paginateAllMembersInOrg(team, page + 1));
}

export { IsUserInTeam2, isUserInTeam2 };

//# debugId=1C85AC88384FF62D64756E2164756E21
