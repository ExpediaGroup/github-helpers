import { IssuesAndPullRequestsResponse } from '../types';
import { QUEUED_FOR_MERGE_PREFIX } from '../constants';
import { addLabels } from '../helpers/add-labels';
import { map } from 'bluebird';
import { removeLabel } from '../helpers/remove-label';

export const updateMergeQueue = (queuedPrs: IssuesAndPullRequestsResponse['data']['items']) => {
  const prsSortedByQueuePosition = queuedPrs
    .map(pr => {
      const label = pr.labels.find(label => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
      const queuePosition = Number(label?.split('#')?.[1]);
      return {
        number: pr.number,
        label,
        queuePosition
      };
    })
    .sort((pr1, pr2) => pr1.queuePosition - pr2.queuePosition);
  return map(prsSortedByQueuePosition, (pr, index) => {
    const pull_number = String(pr.number);
    const { label, queuePosition } = pr;
    const newQueuePosition = index + 1;
    if (!label || queuePosition === newQueuePosition) {
      return;
    }
    return Promise.all([
      addLabels({ pull_number, labels: `${QUEUED_FOR_MERGE_PREFIX} #${newQueuePosition}` }),
      removeLabel({ pull_number, label })
    ]);
  });
};
