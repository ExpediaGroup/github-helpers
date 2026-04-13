import {
  HelperInputs
} from "./main-8h70j5cy.js";
import {
  octokit
} from "./main-4c5nddsb.js";
import {
  context
} from "./main-6avxv4a6.js";
import {
  info
} from "./main-q70tmm6g.js";

// src/helpers/remove-label.ts
class RemoveLabel extends HelperInputs {
  label = "";
}
var removeLabel = async ({ label }) => removeLabelIfExists(label, context.issue.number);
var removeLabelIfExists = async (labelName, issue_number) => {
  try {
    await octokit.issues.removeLabel({
      name: labelName,
      issue_number,
      ...context.repo
    });
  } catch (error) {
    if (error.status === 404) {
      info("Label is not present on PR.");
    }
  }
};

export { RemoveLabel, removeLabel, removeLabelIfExists };

//# debugId=7CFF3D3D62E2681064756E2164756E21
