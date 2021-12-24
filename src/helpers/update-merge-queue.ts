import { addLabels } from './add-labels';
import { context } from '@actions/github';
import { map } from 'bluebird';
import { octokit } from '../octokit';
import { removeLabel } from './remove-label';

export const updateMergeQueue = async () => {
  const { repo, owner } = context.repo;
  const q = encodeURIComponent(`org:${owner} repo:${repo} type:pr state:open label:"QUEUED FOR MERGE"`);
  const {
    data: { items }
  } = await octokit.search.issuesAndPullRequests({ q });
  return map(items, item => {
    const mergeLabel = item.labels.find(label => label.name?.startsWith('QUEUED FOR MERGE'))?.name;
    if (!mergeLabel) {
      return;
    }
    const pull_number = String(item.number);
    const queueNumber = Number(mergeLabel.split('#')[1]);
    return Promise.all([
      addLabels({ pull_number, labels: `QUEUED FOR MERGE #${queueNumber - 1}` }),
      removeLabel({ pull_number, label: mergeLabel })
    ]);
  });
};
