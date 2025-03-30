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
import { context as githubContext } from '@actions/github';
import { octokit } from '../octokit';
import { ChecksUpdateConclusion } from '../types/github';

export class UpdateCheckResult extends HelperInputs {
  context = '';
  sha = '';
  state = '';
  declare description?: string;
}

export const updateCheckResult = async ({ context, sha, state, description }: UpdateCheckResult) => {
  const checks = await octokit.checks.listForRef({
    ref: sha,
    check_name: context,
    ...githubContext.repo
  });
  const check_run_id = checks.data.check_runs[0]?.id;
  if (!check_run_id) {
    throw new Error('Check run not found');
  }

  return octokit.checks.update({
    check_run_id,
    conclusion: state as ChecksUpdateConclusion,
    output: {
      title: description ?? `Check updated to ${state}`,
      summary: 'Check updated via update-check-result helper'
    },
    ...githubContext.repo
  });
};
