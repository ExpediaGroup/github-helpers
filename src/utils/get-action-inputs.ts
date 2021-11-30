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

import { getInputsFromFile } from './get-inputs-from-file';
import { readFileSync } from 'fs';
import { getInput } from '@actions/core';
import { ActionInputs } from '../types';

export const getActionInputs = (): ActionInputs =>
  getInputsFromFile(readFileSync(`${__dirname}/action.yml`).toString())
    .filter(getInput as (input: string) => string)
    .reduce((acc, current) => ({ ...acc, [current]: getInput(current) }), {});
