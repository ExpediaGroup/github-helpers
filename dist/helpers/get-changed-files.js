import {
  getPrNumberFromMergeQueueRef
} from "../main-9ty9m4xy.js";
import"../main-ke778w9b.js";
import {
  getChangedFilepaths
} from "../main-yvnzphn1.js";
import {
  HelperInputs
} from "../main-8h70j5cy.js";
import"../main-4c5nddsb.js";
import {
  context
} from "../main-p94abnca.js";
import"../main-9m3k9gt0.js";
import"../main-q70tmm6g.js";
import"../main-wckvcay0.js";

// src/helpers/get-changed-files.ts
class GetChangedFiles extends HelperInputs {
}
var getChangedFiles = async ({ pattern, delimiter = ",", ignore_deleted }) => {
  const pullNumber = context.eventName === "merge_group" ? getPrNumberFromMergeQueueRef() : context.issue.number;
  const filePaths = await getChangedFilepaths(pullNumber, Boolean(ignore_deleted));
  const filteredFilePaths = pattern ? filePaths.filter((fileName) => fileName.match(pattern)) : filePaths;
  return filteredFilePaths.join(delimiter);
};
export {
  getChangedFiles,
  GetChangedFiles
};

//# debugId=72308F916186F09B64756E2164756E21
