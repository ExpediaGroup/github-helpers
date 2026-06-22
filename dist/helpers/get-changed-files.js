import {
  getPrNumberFromMergeQueueRef
} from "../main-1j4thgyg.js";
import"../main-wzm5rvxy.js";
import {
  getChangedFilepaths,
  getChangedFilepathsFromShas
} from "../main-c27c2k68.js";
import {
  HelperInputs
} from "../main-8h70j5cy.js";
import"../main-4tezksf5.js";
import {
  context
} from "../main-byv6ddq4.js";
import"../main-9m3k9gt0.js";
import"../main-ebvxxjzg.js";
import"../main-wckvcay0.js";

// src/helpers/get-changed-files.ts
class GetChangedFiles extends HelperInputs {
}
var getChangedFiles = async ({ pattern, delimiter = ",", ignore_deleted, pull_number }) => {
  const ignoreDeleted = Boolean(ignore_deleted);
  let filePaths;
  switch (context.eventName) {
    case "push": {
      const { before, after } = context.payload;
      filePaths = await getChangedFilepathsFromShas(before, after, ignoreDeleted);
      break;
    }
    case "merge_group": {
      const pullNumber = pull_number ? Number(pull_number) : getPrNumberFromMergeQueueRef();
      filePaths = await getChangedFilepaths(pullNumber, ignoreDeleted);
      break;
    }
    default: {
      const pullNumber = pull_number ? Number(pull_number) : context.issue.number;
      filePaths = await getChangedFilepaths(pullNumber, ignoreDeleted);
    }
  }
  const filteredFilePaths = pattern ? filePaths.filter((fileName) => fileName.match(pattern)) : filePaths;
  return filteredFilePaths.join(delimiter);
};
export {
  getChangedFiles,
  GetChangedFiles
};

//# debugId=821E26535A99EF0864756E2164756E21
