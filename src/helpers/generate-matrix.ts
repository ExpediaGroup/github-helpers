/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
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
import { chunk } from 'lodash';

export class GenerateMatrix extends HelperInputs {
  paths = '';
  batches?: string;
  load_balancing_sizes?: string;
}

export const generateMatrix = ({ paths, batches: _batches = '1', load_balancing_sizes }: GenerateMatrix) => {
  const matrixValues = paths.split(/[\n,]/);
  const batches = Number(_batches);
  if (!load_balancing_sizes) {
    return {
      include: chunk(matrixValues, Math.ceil(matrixValues.length / batches)).map(chunk => ({ path: chunk.join(',') }))
    };
  } else {
    const loadBalancingSizes = load_balancing_sizes.split(/[\n,]/).map(size => Number(size));
    if (loadBalancingSizes.length !== matrixValues.length) throw new Error('load_balancing_sizes have the same length as paths');
    const targetLoadSize = loadBalancingSizes.reduce((acc, size) => acc + size, 0) / batches;
    const loadBalancedPaths: string[] = [];
    let currentLoadSize = 0;
    let currentBatch: string[] = [];
    matrixValues.forEach((path, index) => {
      const possibleLoadSize = currentLoadSize + loadBalancingSizes[index];
      if (Math.abs(possibleLoadSize - targetLoadSize) <= Math.abs(loadBalancingSizes[index] - targetLoadSize)) {
        currentLoadSize += loadBalancingSizes[index];
        currentBatch.push(path);
      } else {
        loadBalancedPaths.push(currentBatch.join(','));
        currentBatch = [path];
        currentLoadSize = loadBalancingSizes[index];
      }
      if (currentLoadSize >= targetLoadSize) {
        loadBalancedPaths.push(currentBatch.join(','));
        currentBatch = [];
        currentLoadSize = 0;
      }
    });
    if (currentBatch.length > 0) loadBalancedPaths.push(currentBatch.join(','));
    return {
      include: loadBalancedPaths.map(path => ({ path }))
    };
  }
};
