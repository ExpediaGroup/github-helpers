import {
  octokit
} from "./main-4c5nddsb.js";
import {
  context
} from "./main-6avxv4a6.js";

// src/utils/get-changed-filepaths.ts
var getChangedFilepaths = async (pull_number, ignore_deleted) => {
  const changedFiles = await paginateAllChangedFilepaths(pull_number);
  return extractFilepaths(changedFiles, ignore_deleted);
};
var getChangedFilepathsFromShas = async (before, after, ignore_deleted) => {
  const commits = await paginateAllCommitsInRange(before, after);
  const commitFiles = await Promise.all(commits.map(async ({ sha }) => {
    const { data } = await octokit.repos.getCommit({ ref: sha, ...context.repo });
    return data.files ?? [];
  }));
  const fileMap = new Map;
  for (const files of commitFiles) {
    for (const file of files) {
      fileMap.set(file.filename, file);
    }
  }
  return extractFilepaths(Array.from(fileMap.values()), ignore_deleted);
};
var extractFilepaths = (changedFiles, ignore_deleted) => {
  const renamedPreviousFilenames = changedFiles.filter(({ status }) => status === "renamed").map(({ previous_filename }) => previous_filename).filter(Boolean);
  const processedFilenames = (ignore_deleted ? changedFiles.filter(({ status }) => status !== "removed") : changedFiles).map(({ filename }) => filename);
  return processedFilenames.concat(renamedPreviousFilenames);
};
var paginateAllCommitsInRange = async (before, after, page = 1) => {
  const response = await octokit.repos.compareCommitsWithBasehead({
    basehead: `${before}...${after}`,
    per_page: 100,
    page,
    ...context.repo
  });
  if (!response.data.commits.length) {
    return [];
  }
  return [...response.data.commits, ...await paginateAllCommitsInRange(before, after, page + 1)];
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

export { getChangedFilepaths, getChangedFilepathsFromShas };

//# debugId=2E0A7BCC27CA034E64756E2164756E21
