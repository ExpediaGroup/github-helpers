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
import micromatch from 'micromatch';
import * as core from '@actions/core';
import { PullRequest, SimplePullRequest } from '../types/github';
import { paginateAllOpenPullRequests } from '../utils/paginate-open-pull-requests';
import { map } from 'bluebird';
import { setCommitStatus } from './set-commit-status';

export class CheckMergeSafety extends HelperInputs {
  paths = '';
  override_filter_paths?: string;
  override_filter_globs?: string;
}

export const checkMergeSafety = async (inputs: CheckMergeSafety) => {
  const prNumber = context.issue.number;
  core.info(String(prNumber));
  if (!prNumber) {
    const pullRequests = await paginateAllOpenPullRequests();
    return map(pullRequests, async pullRequest => {
      const isSafeToMerge = await prIsSafeToMerge(pullRequest, inputs);
      await setCommitStatus({
        sha: pullRequest.head.sha,
        state: isSafeToMerge ? 'success' : 'failure',
        context: 'Merge Safety',
        ...context.repo
      });
    });
  }
  const { data: pullRequest } = await octokit.pulls.get({ pull_number: prNumber, ...context.repo });

  const isSafeToMerge = await prIsSafeToMerge(pullRequest, inputs);

  if (!isSafeToMerge) {
    throw new Error();
  }

  core.info('This PR is safe to merge!');
};

const prIsSafeToMerge = async (
  pullRequest: SimplePullRequest | PullRequest,
  { paths, override_filter_paths, override_filter_globs }: CheckMergeSafety
) => {
  const {
    base: {
      repo: { default_branch }
    },
    head: { ref }
  } = pullRequest;
  const {
    data: { files: filesWhichBranchIsBehindOn }
  } = await octokit.repos.compareCommitsWithBasehead({
    ...context.repo,
    basehead: `${ref}...${default_branch}`
  });
  const fileNamesWhichBranchIsBehindOn = filesWhichBranchIsBehindOn?.map(file => file.filename) ?? [];

  const shouldOverrideSafetyCheck = override_filter_globs
    ? micromatch(fileNamesWhichBranchIsBehindOn, override_filter_globs.split('\n')).length > 0
    : fileNamesWhichBranchIsBehindOn.some(changedFile => override_filter_paths?.split(/[\n,]/).includes(changedFile));

  if (shouldOverrideSafetyCheck) {
    core.error(`This branch is out of date on one ore more files critical to the repo! Please update ${ref} with ${default_branch}.`);
    return false;
  }

  const {
    data: { files: changedFiles }
  } = await octokit.repos.compareCommitsWithBasehead({
    ...context.repo,
    basehead: `${default_branch}...${ref}`
  });
  const changedFileNames = changedFiles?.map(file => file.filename);
  const projectDirectories = paths.split(/[\n,]/);
  const isUnsafeToMerge = projectDirectories.some(
    dir => fileNamesWhichBranchIsBehindOn.some(file => file.includes(dir)) && changedFileNames?.some(file => file.includes(dir))
  );

  if (isUnsafeToMerge) {
    core.error(`This branch is out of date on a project being changed in this PR. Please update ${ref} with ${default_branch}.`);
    return false;
  }

  return true;
};
