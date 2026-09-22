import {
  error
} from "../main-36vzaw22.js";
import {
  context
} from "../main-nnwtk8w8.js";
import"../main-6sabwhac.js";
import"../main-fh8gy58w.js";
import {
  require_micromatch
} from "../main-hatr91y7.js";
import {
  getChangedFilepaths
} from "../main-8fvwf10s.js";
import {
  require_lodash
} from "../main-t2wes6yn.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";
import {
  __toESM
} from "../main-syahy8j8.js";

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
      include: import_lodash.chunk(matrixValues, Math.ceil(matrixValues.length / Number(batches))).map((chunk) => ({ path: chunk.join(",") }))
    };
  }
  return {
    include: matrixValues.map((path) => ({ path }))
  };
};
export {
  GeneratePathMatrix,
  generatePathMatrix
};

//# debugId=EBF5E5F69122D62B64756E2164756E21
