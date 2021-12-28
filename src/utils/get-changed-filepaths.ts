import { context } from '@actions/github';
import { octokit } from '../octokit';

export const getChangedFilepaths = (pull_number: number) =>
  octokit.pulls
    .listFiles({
      pull_number,
      per_page: 100,
      ...context.repo
    })
    .then(listFilesResponse => listFilesResponse.data.map(file => file.filename));
