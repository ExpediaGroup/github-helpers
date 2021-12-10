import { context } from '@actions/github';
import { octokit } from '../octokit';

export const getChangedFilepaths = (pull_number: string) =>
  octokit.pulls
    .listFiles({
      pull_number: Number(pull_number),
      per_page: 100,
      ...context.repo
    })
    .then(listFilesResponse => listFilesResponse.data.map(file => file.filename));
