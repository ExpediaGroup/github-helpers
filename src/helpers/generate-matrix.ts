/*
Copyright 2021 Expedia, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { HelperInputs } from '../types/generated';
import { chunk, sum } from 'lodash';

export class GenerateMatrix extends HelperInputs {
  paths = '';
  declare batches?: string;
  declare load_balancing_sizes?: string;
  declare use_basic_matrix_configuration?: string;
}

export const generateMatrix = ({
  paths,
  batches: _batches = '1',
  load_balancing_sizes,
  use_basic_matrix_configuration = ''
}: GenerateMatrix) => {
  const matrixValues = paths.split(/[\n,]/);
  const batches = Number(_batches);
  let result;
  if (!load_balancing_sizes || matrixValues.length <= batches) {
    const chunkedList = chunk(matrixValues, Math.ceil(matrixValues.length / batches)).map(chunk => chunk.join(','));
    if (use_basic_matrix_configuration === 'true') result = { path: chunkedList };
    else result = { include: chunkedList.map(chunk => ({ path: chunk })) };
  } else {
    const loadBalancingSizes = load_balancing_sizes.split(/[\n,]/).map(size => Number(size));
    if (loadBalancingSizes.length !== matrixValues.length)
      throw new Error('load_balancing_sizes input must have the same length as paths input');
    const targetLoadSize = sum(loadBalancingSizes) / batches;
    const loadBalancedPaths: string[] = [];
    let currentLoadSize = 0;
    let currentBatch: string[] = [];
    matrixValues.forEach((path, index) => {
      if (Number.isNaN(loadBalancingSizes[index])) throw new Error('load_balancing_sizes input must contain values');
      // we've already validated that a value exists at this index above, but TS really _needs_ to see us validate it againgit
      const loadAtIndex = (loadBalancingSizes[index] !== undefined ? loadBalancingSizes[index] : 0) as number;
      const possibleLoadSize = currentLoadSize + loadAtIndex;
      if (Math.abs(possibleLoadSize - targetLoadSize) <= Math.abs(loadAtIndex - targetLoadSize)) {
        currentLoadSize += loadAtIndex;
        currentBatch.push(path);
      } else {
        loadBalancedPaths.push(currentBatch.join(','));
        currentBatch = [path];
        currentLoadSize = loadAtIndex;
      }
      if (currentLoadSize >= targetLoadSize) {
        loadBalancedPaths.push(currentBatch.join(','));
        currentBatch = [];
        currentLoadSize = 0;
      }
    });
    if (currentBatch.length > 0) loadBalancedPaths.push(currentBatch.join(','));
    if (use_basic_matrix_configuration === 'true') result = { path: loadBalancedPaths };
    else result = { include: loadBalancedPaths.map(path => ({ path })) };
  }
  return result;
};
