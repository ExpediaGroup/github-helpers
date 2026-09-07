import {
  context
} from "../main-agjmamh8.js";
import"../main-5k5kzfdy.js";
import"../main-36vzaw22.js";
import {
  octokit
} from "../main-e3smtmr1.js";
import {
  esm_default
} from "../main-vsxf8dq8.js";
import {
  getDefaultBranch
} from "../main-khtnpn98.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";

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
  CreatePR,
  createPr
};

//# debugId=BBC48B370CF149C464756E2164756E21
