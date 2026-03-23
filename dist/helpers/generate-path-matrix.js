import {
  require_micromatch
} from "../main-v9jqraeg.js";
import {
  getChangedFilepaths
} from "../main-yvnzphn1.js";
import {
  require_lodash
} from "../main-kzxwm80c.js";
import {
  HelperInputs
} from "../main-8h70j5cy.js";
import"../main-4c5nddsb.js";
import {
  context
} from "../main-p94abnca.js";
import"../main-9m3k9gt0.js";
import {
  error
} from "../main-q70tmm6g.js";
import {
  __toESM
} from "../main-wckvcay0.js";

// src/helpers/generate-path-matrix.ts
var import_lodash = __toESM(require_lodash(), 1);
var import_micromatch = __toESM(require_micromatch(), 1);

class GeneratePathMatrix extends HelperInputs {
}
var generatePathMatrix = async ({
  paths,
  globs,
  override_filter_paths,
  override_filter_globs,
  paths_no_filter,
  batches
}) => {
  const pathsToUse = paths || globs;
  if (!pathsToUse) {
    error("Must supply one of paths, globs");
    throw new Error;
  }
  const changedFiles = await getChangedFilepaths(context.issue.number);
  const shouldOverrideFilter = override_filter_globs ? import_micromatch.default(changedFiles, override_filter_globs.split(`
`)).length > 0 : changedFiles.some((changedFile) => override_filter_paths?.split(/[\n,]/).includes(changedFile));
  const splitPaths = pathsToUse.split(/[\n,]/);
  const basePaths = shouldOverrideFilter ? splitPaths : paths ? splitPaths.filter((path) => changedFiles.some((changedFile) => changedFile.startsWith(path))) : splitPaths.filter((glob) => import_micromatch.default(changedFiles, glob).length > 0);
  const extraPaths = paths_no_filter?.split(/[\n,]/) ?? [];
  const matrixValues = import_lodash.uniq(basePaths.concat(extraPaths));
  if (batches) {
    return {
      include: import_lodash.chunk(matrixValues, Math.ceil(matrixValues.length / Number(batches))).map((chunk2) => ({ path: chunk2.join(",") }))
    };
  }
  return {
    include: matrixValues.map((path) => ({ path }))
  };
};
export {
  generatePathMatrix,
  GeneratePathMatrix
};

//# debugId=5F012EC0CB77383764756E2164756E21
