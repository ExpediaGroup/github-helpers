import {
  octokit
} from "./main-4c5nddsb.js";
import {
  context
} from "./main-6avxv4a6.js";

// src/utils/get-changed-filepaths.ts
var getChangedFilepaths = async (pull_number, ignore_deleted) => {
  const changedFiles = await paginateAllChangedFilepaths(pull_number);
  const renamedPreviousFilenames = changedFiles.filter(({ status }) => status === "renamed").map(({ previous_filename }) => previous_filename).filter(Boolean);
  const processedFilenames = (ignore_deleted ? changedFiles.filter(({ status }) => status !== "removed") : changedFiles).map(({ filename }) => filename);
  return processedFilenames.concat(renamedPreviousFilenames);
};
var paginateAllChangedFilepaths = async (pull_number, page = 1) => {
  const response = await octokit.pulls.listFiles({
    pull_number,
    per_page: 100,
    page,
    ...context.repo
  });
  if (!response.data.length) {
    return [];
  }
  return response.data.concat(await paginateAllChangedFilepaths(pull_number, page + 1));
};

export { getChangedFilepaths };

//# debugId=6D348EB52520D05064756E2164756E21
