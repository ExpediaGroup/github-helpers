import {
  HelperInputs
} from "./main-8h70j5cy.js";
import {
  octokit
} from "./main-4c5nddsb.js";
import {
  context
} from "./main-p94abnca.js";
import {
  info
} from "./main-q70tmm6g.js";

// src/helpers/is-user-in-team.ts
class IsUserInTeam extends HelperInputs {
  team = "";
}
var isUserInTeam = async ({ login = context.actor, team }) => {
  const members = await paginateAllMembersInOrg(team);
  info(`Checking if ${login} is in team ${team}`);
  info(`Team members: ${members.map(({ login: login2 }) => login2).join(", ")}`);
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

export { IsUserInTeam, isUserInTeam };

//# debugId=896A778DC79AC7D964756E2164756E21
