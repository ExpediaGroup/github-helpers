import { PullRequestList } from '../types/github';
import { octokit } from '../octokit';
import { context } from '@actions/github';

export const paginateAllOpenPullRequests = async (page = 1): Promise<PullRequestList> => {
  const response = await octokit.pulls.list({
    state: 'open',
    sort: 'updated',
    direction: 'desc',
    per_page: 100,
    page,
    ...context.repo
  });
  if (!response.data.length) {
    return [];
  }
  return response.data.concat(await paginateAllOpenPullRequests(page + 1));
};
