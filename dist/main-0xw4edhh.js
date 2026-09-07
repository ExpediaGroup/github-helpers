import {
  info
} from "./main-36vzaw22.js";
import {
  context
} from "./main-agjmamh8.js";
import {
  octokit
} from "./main-e3smtmr1.js";
import {
  HelperInputs
} from "./main-d5wrnkmf.js";

// src/helpers/remove-label.ts
class RemoveLabel2 extends HelperInputs {
  label = "";
}
var removeLabel2 = async ({ label }) => removeLabelIfExists2(label, context.issue.number);
var removeLabelIfExists2 = async (labelName, issue_number) => {
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

export { RemoveLabel2, removeLabel2, removeLabelIfExists2 };

//# debugId=11BC2965636DFE4264756E2164756E21
