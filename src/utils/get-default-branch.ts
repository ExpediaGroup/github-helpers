import { octokit } from '../octokit';
import { context } from '@actions/github';

export const getDefaultBranch = async () => {
  const {
    data: { default_branch }
  } = await octokit.repos.get({ ...context.repo });
  return default_branch;
};
