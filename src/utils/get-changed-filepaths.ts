import { context } from '@actions/github';
import { octokit } from '../octokit';

export const getChangedFilepaths = async (pull_number: number) => {
  const { data } = await octokit.pulls.listFiles({
    pull_number,
    per_page: 100,
    ...context.repo
  });
  return data.map(file => file.filename);
};
