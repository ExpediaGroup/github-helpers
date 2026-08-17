import {
  getPrNumberFromMergeQueueRef
} from "../main-sxgb8rbs.js";
import"../main-c6wqy9ex.js";
import {
  HelperInputs
} from "../main-8h70j5cy.js";
import {
  octokitGraphql
} from "../main-0559yt64.js";
import {
  context
} from "../main-gex27b9s.js";
import"../main-tntkhvke.js";
import"../main-ebvxxjzg.js";
import"../main-wckvcay0.js";

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
  getMergeQueuePosition,
  GetMergeQueuePosition
};

//# debugId=5DC7171F22511ECD64756E2164756E21
