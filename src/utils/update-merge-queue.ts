import { IssuesAndPullRequestsResponse } from '../types';
import { QUEUED_FOR_MERGE_PREFIX } from '../constants';
import { addLabels } from '../helpers/add-labels';
import { map } from 'bluebird';
import { removeLabel } from '../helpers/remove-label';

export const updateMergeQueue = (queuedPrs: IssuesAndPullRequestsResponse['data']['items']) => {
  return map(queuedPrs, pr => {
    const queueLabel = pr.labels.find(label => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
    if (!queueLabel) {
      return;
    }
    const pull_number = String(pr.number);
    const queueNumber = Number(queueLabel.split('#')[1]);
    return Promise.all([
      addLabels({ pull_number, labels: `${QUEUED_FOR_MERGE_PREFIX} #${queueNumber - 1}` }),
      removeLabel({ pull_number, label: queueLabel })
    ]);
  });
};
