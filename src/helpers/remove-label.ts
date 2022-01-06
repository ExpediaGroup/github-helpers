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
import { context } from '@actions/github';
import { octokit } from '../octokit';

interface RemoveLabel {
  label: string;
}

export const removeLabel = ({ label }: RemoveLabel) => removeLabelIfExists(label, context.issue.number);

export const removeLabelIfExists = (labelName: string, issue_number: number) =>
  octokit.issues
    .removeLabel({
      name: labelName,
      issue_number,
      ...context.repo
    })
    .catch(error => {
      if (error.status === 404) {
        core.info('Label is not present on PR.');
      }
    });
