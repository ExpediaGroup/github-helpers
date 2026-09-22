import {
  octokit
} from "./main-fh8gy58w.js";
import {
  context
} from "./main-nnwtk8w8.js";

// src/utils/paginate-open-pull-requests.ts
var paginateAllOpenPullRequests = async (page = 1) => {
  const response = await octokit.pulls.list({
    state: "open",
    sort: "updated",
    direction: "desc",
    per_page: 100,
    page,
    ...context.repo
  });
  if (!response.data.length) {
    return [];
  }
  return response.data.concat(await paginateAllOpenPullRequests(page + 1));
};

export { paginateAllOpenPullRequests };

//# debugId=46B974B514C3664D64756E2164756E21
