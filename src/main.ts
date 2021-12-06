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

import * as core from '@actions/core';
import { camelCase } from 'lodash';
import { getActionInputs } from './utils/get-action-inputs';

export const run = async () => {
  try {
    const helper = core.getInput('helper', { required: true });
    const helperModule = await import(`./helpers/${helper}`);
    const method = helperModule[camelCase(helper)];
    const actionInputs = getActionInputs();
    const output = await method(actionInputs);
    core.setOutput('output', output);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
