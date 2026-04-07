import {
  esm_default
} from "../main-29zhc9fw.js";
import {
  getDefaultBranch
} from "../main-dbfe86ee.js";
import"../main-dkdfy8cx.js";
import {
  HelperInputs
} from "../main-8h70j5cy.js";
import {
  octokit
} from "../main-4c5nddsb.js";
import {
  context
} from "../main-p94abnca.js";
import"../main-9m3k9gt0.js";
import"../main-q70tmm6g.js";
import"../main-wckvcay0.js";

// src/helpers/create-pr.ts
class CreatePR extends HelperInputs {
  title = "";
  body = "";
}
var createPr = async ({ title, body, head, base, return_full_payload, branch_name, commit_message }) => {
  const resolvedHead = await getOrCreateHeadBranch({ head, branch_name, commit_message });
  const pr_base = base || await getDefaultBranch();
  await updateHeadWithBaseBranch(pr_base, resolvedHead);
  const { data } = await octokit.pulls.create({
    title,
    head: resolvedHead,
    base: pr_base,
    body,
    maintainer_can_modify: true,
    ...context.repo
  });
  return return_full_payload === "true" ? data : data.number;
};
var getOrCreateHeadBranch = async ({ head, branch_name, commit_message }) => {
  if (branch_name && commit_message) {
    const git = esm_default();
    await git.addConfig("user.name", "github-actions[bot]");
    await git.addConfig("user.email", "github-actions[bot]@users.noreply.github.com");
    await git.checkoutLocalBranch(branch_name);
    await git.add(".");
    await git.commit(commit_message);
    await git.push("origin", branch_name);
    return branch_name;
  }
  return head || context.ref.replace("refs/heads/", "");
};
var updateHeadWithBaseBranch = (base, head) => octokit.repos.merge({
  base: head,
  head: base,
  ...context.repo
});
export {
  createPr,
  CreatePR
};

//# debugId=479223F3A342C37B64756E2164756E21
