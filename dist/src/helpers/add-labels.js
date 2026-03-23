import {
  HelperInputs
} from "../../main-8h70j5cy.js";
import {
  octokit
} from "../../main-4c5nddsb.js";
import {
  context
} from "../../main-p94abnca.js";
import"../../main-9m3k9gt0.js";
import"../../main-q70tmm6g.js";
import"../../main-wckvcay0.js";

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
  addLabels,
  AddLabels
};

//# debugId=A533AC96D0BD4F7B64756E2164756E21
