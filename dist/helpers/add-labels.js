import {
  context
} from "../main-nnwtk8w8.js";
import"../main-6sabwhac.js";
import"../main-36vzaw22.js";
import {
  octokit
} from "../main-fh8gy58w.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";

// src/helpers/add-labels.ts
class AddLabels extends HelperInputs {
  labels = "";
}
var addLabels = ({ labels }) => octokit.issues.addLabels({
  labels: labels.split(`
`),
  issue_number: context.issue.number,
  ...context.repo
});
export {
  AddLabels,
  addLabels
};

//# debugId=60BD84F538EFAE3F64756E2164756E21
