import { context } from '@actions/github';
import { octokit } from '../octokit';

export const addPrToMergeQueue = async () => {
  const { repo, owner } = context.repo;
  const q = encodeURIComponent(`org:${owner} repo:${repo} type:pr state:open label:"QUEUED FOR MERGE"`);
  const {
    data: { total_count }
  } = await octokit.search.issuesAndPullRequests({ q });
  return octokit.issues.addLabels({
    labels: [`QUEUED FOR MERGE #${total_count + 1}`],
    issue_number: context.issue.number,
    ...context.repo
  });
};
