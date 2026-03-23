import {
  getPrNumberFromMergeQueueRef
} from "../../main-9ty9m4xy.js";
import"../../main-ke778w9b.js";
import {
  HelperInputs
} from "../../main-8h70j5cy.js";
import {
  octokitGraphql
} from "../../main-4c5nddsb.js";
import {
  context
} from "../../main-p94abnca.js";
import"../../main-9m3k9gt0.js";
import"../../main-q70tmm6g.js";
import"../../main-wckvcay0.js";

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
