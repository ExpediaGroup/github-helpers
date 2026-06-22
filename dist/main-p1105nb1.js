import {
  octokit
} from "./main-4c5nddsb.js";
import {
  context
} from "./main-6avxv4a6.js";

// src/utils/get-default-branch.ts
var getDefaultBranch = async () => {
  const {
    data: { default_branch }
  } = await octokit.repos.get({ ...context.repo });
  return default_branch;
};

export { getDefaultBranch };

//# debugId=622F718A3085CB9F64756E2164756E21
