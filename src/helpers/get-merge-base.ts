/*
Copyright 2023 Expedia, Inc.
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

export const getMergeBase = async () => {
  try {
    const { data: pullRequest } = await octokit.pulls.get({ pull_number: context.issue.number, ...context.repo });
    return pullRequest.base.sha;
  } catch (error) {
    core.error(`Error while fetching merge base commit SHA: ${error}`);
  }
  return null;
};
