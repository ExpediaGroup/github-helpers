import {
  context
} from "../main-nnwtk8w8.js";
import"../main-6sabwhac.js";
import {
  error
} from "../main-36vzaw22.js";

// src/helpers/create-batched-commit-message.ts
var createBatchedCommitMessage = () => {
  const eventPayload = context.payload;
  if (!("commits" in eventPayload)) {
    error("No commits found in the event payload.");
    return;
  }
  const maxCharactersPerMessage = 50;
  return eventPayload.commits.map((commit) => {
    const prNumberWithParens = commit.message.match(/\(#(\d+)\)/)?.[0] ?? "";
    const messageWithoutPrNumber = commit.message.replace(prNumberWithParens, "").split(`
`)[0]?.trim() ?? "";
    const truncatedMessage = messageWithoutPrNumber.slice(0, maxCharactersPerMessage);
    const ellipses = truncatedMessage.length < messageWithoutPrNumber.length ? "..." : "";
    return `${truncatedMessage}${ellipses} ${prNumberWithParens}`;
  }).join(" and ");
};
export {
  createBatchedCommitMessage
};

//# debugId=7D43A772456337F364756E2164756E21
