import {
  context
} from "../main-nnwtk8w8.js";
import"../main-6sabwhac.js";
import"../main-36vzaw22.js";
import {
  octokitGraphql
} from "../main-fh8gy58w.js";
import {
  getPrNumberFromMergeQueueRef
} from "../main-g4wfn82f.js";
import"../main-00tcd9f5.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";

// src/helpers/get-merge-queue-position.ts
class GetMergeQueuePosition extends HelperInputs {
}
var getMergeQueuePosition = async ({ max_queue_size = "10" }) => {
  const { repository } = await octokitGraphql(`
query {
  repository(owner: "${context.repo.owner}", name: "${context.repo.repo}") {
    mergeQueue {
      entries(first: ${max_queue_size}) {
        nodes {
          pullRequest {
            number
          }
          position
        }
      }
    }
  }
}
`);
  const prNumberFromMergeQueueRef = getPrNumberFromMergeQueueRef();
  const mergeQueueEntries = repository.mergeQueue?.entries?.nodes;
  return mergeQueueEntries?.find((entry) => entry?.pullRequest?.number === prNumberFromMergeQueueRef)?.position;
};
export {
  GetMergeQueuePosition,
  getMergeQueuePosition
};

//# debugId=4A778328F1AF83C964756E2164756E21
