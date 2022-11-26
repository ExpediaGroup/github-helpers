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
import { context } from '@actions/github';
import { octokit } from '../octokit';
import { getDefaultBranch } from '../utils/get-default-branch';
import micromatch from 'micromatch';
import * as core from '@actions/core';

export class CheckMergeSafety extends HelperInputs {
  base = '';
  paths = '';
  override_filter_paths?: string;
  override_filter_globs?: string;
}

export const checkMergeSafety = async ({ base, paths, override_filter_paths, override_filter_globs }: CheckMergeSafety) => {
  const defaultBranch = await getDefaultBranch();
  const {
    data: { files: filesWhichBranchIsBehindOn }
  } = await octokit.repos.compareCommitsWithBasehead({
    ...context.repo,
    basehead: `${base}...${defaultBranch}`
  });
  const fileNamesWhichBranchIsBehindOn = filesWhichBranchIsBehindOn?.map(file => file.filename) ?? [];
  core.info(JSON.stringify(fileNamesWhichBranchIsBehindOn));

  const shouldOverrideSafetyCheck = override_filter_globs
    ? micromatch(fileNamesWhichBranchIsBehindOn, override_filter_globs.split('\n')).length > 0
    : fileNamesWhichBranchIsBehindOn.some(changedFile => override_filter_paths?.split(/[\n,]/).includes(changedFile));
  if (shouldOverrideSafetyCheck) {
    throw new Error(`Please update ${base} with ${defaultBranch}`);
  }

  const {
    data: { files: changedFiles }
  } = await octokit.repos.compareCommitsWithBasehead({
    ...context.repo,
    basehead: `${defaultBranch}...${base}`
  });
  const changedFileNames = changedFiles?.map(file => file.filename);
  core.info(JSON.stringify(changedFileNames));
  const projectDirectories = paths.split(/[\n,]/);
  const isUnsafeToMerge = changedFileNames?.some(changedFile => projectDirectories.some(dir => changedFile.includes(dir)));

  if (isUnsafeToMerge) {
    throw new Error(`Please update ${base} with ${defaultBranch}`);
  }

  core.info('This PR is safe to merge!');
};
