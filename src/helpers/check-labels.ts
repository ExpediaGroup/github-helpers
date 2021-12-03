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
import { octokit } from '../octokit';
import { context } from '@actions/github';

interface CheckLabels {
  pull_number: string;
  contains_all_labels: string;
}

export const checkLabels = ({ pull_number, contains_all_labels }: CheckLabels) => {
  return octokit.pulls
    .get({
      pull_number: Number(pull_number),
      ...context.repo
    })
    .then(response => {
      const prLabels = response.data.labels.filter(label => label.name != null).map(label => label.name);
      const requiredLabels = contains_all_labels.split(',').map(label => label.trim());

      if (requiredLabels.every(label => prLabels.includes(label))) {
        return true;
      }
      setFailed(`Pull request does not have all these labels: ${contains_all_labels}`);
      return false;
    });
};
