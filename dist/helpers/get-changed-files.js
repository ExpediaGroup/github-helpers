import {
  context
} from "../main-agjmamh8.js";
import"../main-5k5kzfdy.js";
import"../main-36vzaw22.js";
import"../main-e3smtmr1.js";
import {
  getPrNumberFromMergeQueueRef
} from "../main-we9k256r.js";
import"../main-9fzkbq68.js";
import {
  getChangedFilepaths,
  getChangedFilepathsFromShas
} from "../main-j9t824v1.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";

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
  GetChangedFiles,
  getChangedFiles
};

//# debugId=3F804A250337AF3A64756E2164756E21
