import { context } from '@actions/github';
import { octokit } from '../octokit';

export const addPrToMergeQueue = async () => {
  const pull_number = context.issue.number;
  const {
    data: { id }
  } = await octokit.repos.get({ ...context.repo, pull_number });
  const {
    data: { total_count }
  } = await octokit.search.labels({ repository_id: id, q: 'QUEUED FOR MERGE' });
  return octokit.issues.addLabels({
    labels: [`QUEUED FOR MERGE #${total_count + 1}`],
    issue_number: pull_number,
    ...context.repo
  });
};
