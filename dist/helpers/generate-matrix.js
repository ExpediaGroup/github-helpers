import {
  require_lodash
} from "../main-t2wes6yn.js";
import {
  HelperInputs
} from "../main-d5wrnkmf.js";
import {
  __toESM
} from "../main-syahy8j8.js";

// src/helpers/generate-matrix.ts
var import_lodash = __toESM(require_lodash(), 1);

class GenerateMatrix extends HelperInputs {
  paths = "";
}
var generateMatrix = ({
  paths,
  batches: _batches = "1",
  load_balancing_sizes,
  use_basic_matrix_configuration = ""
}) => {
  const matrixValues = paths.split(/[\n,]/);
  const batches = Number(_batches);
  let result;
  if (!load_balancing_sizes || matrixValues.length <= batches) {
    const chunkedList = import_lodash.chunk(matrixValues, Math.ceil(matrixValues.length / batches)).map((chunk) => chunk.join(","));
    if (use_basic_matrix_configuration === "true")
      result = { path: chunkedList };
    else
      result = { include: chunkedList.map((chunk) => ({ path: chunk })) };
  } else {
    const loadBalancingSizes = load_balancing_sizes.split(/[\n,]/).map((size) => Number(size));
    if (loadBalancingSizes.length !== matrixValues.length)
      throw new Error("load_balancing_sizes input must have the same length as paths input");
    const targetLoadSize = import_lodash.sum(loadBalancingSizes) / batches;
    const loadBalancedPaths = [];
    let currentLoadSize = 0;
    let currentBatch = [];
    matrixValues.forEach((path, index) => {
      if (Number.isNaN(loadBalancingSizes[index]))
        throw new Error("load_balancing_sizes input must contain values");
      const loadAtIndex = loadBalancingSizes[index] !== undefined ? loadBalancingSizes[index] : 0;
      const possibleLoadSize = currentLoadSize + loadAtIndex;
      if (Math.abs(possibleLoadSize - targetLoadSize) <= Math.abs(loadAtIndex - targetLoadSize)) {
        currentLoadSize += loadAtIndex;
        currentBatch.push(path);
      } else {
        loadBalancedPaths.push(currentBatch.join(","));
        currentBatch = [path];
        currentLoadSize = loadAtIndex;
      }
      if (currentLoadSize >= targetLoadSize) {
        loadBalancedPaths.push(currentBatch.join(","));
        currentBatch = [];
        currentLoadSize = 0;
      }
    });
    if (currentBatch.length > 0)
      loadBalancedPaths.push(currentBatch.join(","));
    if (use_basic_matrix_configuration === "true")
      result = { path: loadBalancedPaths };
    else
      result = { include: loadBalancedPaths.map((path) => ({ path })) };
  }
  return result;
};
export {
  GenerateMatrix,
  generateMatrix
};

//# debugId=DF1E8AC2B64DE6AE64756E2164756E21
