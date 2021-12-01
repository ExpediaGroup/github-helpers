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

import { setFailed } from '@actions/core';
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { DEFAULT_PR_TITLE_REGEX } from '../constants';

interface CheckPrTitle {
  pull_number: string;
  pattern?: string;
}

export const checkPrTitle = ({ pull_number, pattern = DEFAULT_PR_TITLE_REGEX }: CheckPrTitle) => {
  const regex = new RegExp(pattern);
  return octokit.pulls
    .get({
      pull_number: Number(pull_number),
      ...context.repo
    })
    .then(prResponse => {
      if (regex.test(prResponse.data.title)) {
        return true;
      }
      setFailed('Pull request title does not meet requirements.');
      return false;
    });
};
