import { QUEUED_FOR_MERGE_PREFIX } from '../constants';
import { context } from '@actions/github';
import { octokit } from '../octokit';

export const getQueuedPrData = () => {
  const { repo, owner } = context.repo;
  return octokit.search.issuesAndPullRequests({
    q: encodeURIComponent(`org:${owner} repo:${repo} type:pr state:open label:"${QUEUED_FOR_MERGE_PREFIX}"`)
  });
};
