import { QUEUED_FOR_MERGE_PREFIX } from '../constants';
import { addLabels } from './add-labels';
import { getQueuedPrData } from '../utils/get-queued-pr-data';
import { map } from 'bluebird';
import { removeLabel } from './remove-label';

export const updateMergeQueue = async () => {
  const {
    data: { items }
  } = await getQueuedPrData();
  return map(items, item => {
    const mergeLabel = item.labels.find(label => label.name?.startsWith(QUEUED_FOR_MERGE_PREFIX))?.name;
    if (!mergeLabel) {
      return;
    }
    const pull_number = String(item.number);
    const queueNumber = Number(mergeLabel.split('#')[1]);
    return Promise.all([
      addLabels({ pull_number, labels: `${QUEUED_FOR_MERGE_PREFIX} #${queueNumber - 1}` }),
      removeLabel({ pull_number, label: mergeLabel })
    ]);
  });
};
