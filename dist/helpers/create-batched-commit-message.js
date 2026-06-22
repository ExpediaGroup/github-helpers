import {
  context
} from "../main-6avxv4a6.js";
import"../main-9m3k9gt0.js";
import {
  error
} from "../main-q70tmm6g.js";
import"../main-wckvcay0.js";

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

//# debugId=6714029BED24CE3D64756E2164756E21
