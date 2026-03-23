import {
  octokit
} from "./main-4c5nddsb.js";
import {
  context
} from "./main-p94abnca.js";

// src/utils/paginate-all-branches.ts
var paginateAllBranches = async ({
  protectedBranches,
  page = 1
} = {}) => {
  const response = await octokit.repos.listBranches({
    protected: protectedBranches,
    per_page: 100,
    page,
    ...context.repo
  });
  if (!response.data.length) {
    return [];
  }
  return [...response.data, ...await paginateAllBranches({ protectedBranches, page: page + 1 })];
};

export { paginateAllBranches };

//# debugId=8E93FCFE6B11DA6F64756E2164756E21
