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
import { PullRequest } from '../types/github';
import { paginateAllOpenPullRequests } from '../utils/paginate-open-pull-requests';
import { map } from 'bluebird';
import { setCommitStatus } from './set-commit-status';
import * as core from '@actions/core';

export class CheckMergeSafety extends HelperInputs {
  paths?: string;
  override_filter_paths?: string;
  override_filter_globs?: string;
}

export const checkMergeSafety = async (inputs: CheckMergeSafety) => {
  const isPrWorkflow = Boolean(context.issue.number);
  if (!isPrWorkflow) {
    return handlePushWorkflow(inputs);
  }
  const { data: pullRequest } = await octokit.pulls.get({ pull_number: context.issue.number, ...context.repo });

  const message = await getMergeSafetyMessage(pullRequest, inputs);

  if (message) {
    throw new Error(message);
  }

  core.info('This branch is safe to merge!');
};

const handlePushWorkflow = async (inputs: CheckMergeSafety) => {
  const pullRequests = await paginateAllOpenPullRequests();
  const filteredPullRequests = pullRequests.filter(({ base, draft }) => !draft && base.ref === base.repo.default_branch);
  return map(filteredPullRequests, async pullRequest => {
    const message = await getMergeSafetyMessage(pullRequest as PullRequest, inputs);
    await setCommitStatus({
      sha: pullRequest.head.sha,
      state: message ? 'failure' : 'success',
      context: 'Merge Safety',
      description: message ?? 'This branch is safe to merge!',
      ...context.repo
    });
  });
};

const getMergeSafetyMessage = async (
  pullRequest: PullRequest,
  { paths, override_filter_paths, override_filter_globs }: CheckMergeSafety
) => {
  const {
    base: {
      repo: {
        default_branch,
        owner: { login: baseOwner }
      }
    },
    head: {
      ref,
      user: { login: username }
    }
  } = pullRequest;
  const {
    data: { files: filesWhichBranchIsBehindOn }
  } = await octokit.repos.compareCommitsWithBasehead({
    ...context.repo,
    basehead: `${username}:${ref}...${baseOwner}:${default_branch}`
  });
  const fileNamesWhichBranchIsBehindOn = filesWhichBranchIsBehindOn?.map(file => file.filename) ?? [];

  const shouldOverrideSafetyCheck = override_filter_globs
    ? micromatch(fileNamesWhichBranchIsBehindOn, override_filter_globs.split('\n')).length > 0
    : override_filter_paths
    ? fileNamesWhichBranchIsBehindOn.some(changedFile => override_filter_paths.split(/[\n,]/).includes(changedFile))
    : false;

  if (shouldOverrideSafetyCheck) {
    return `This branch has one or more outdated global files. Please update with ${default_branch}.`;
  }

  const {
    data: { files: changedFiles }
  } = await octokit.repos.compareCommitsWithBasehead({
    ...context.repo,
    basehead: `${baseOwner}:${default_branch}...${username}:${ref}`
  });
  const changedFileNames = changedFiles?.map(file => file.filename);
  const projectDirectories = paths?.split(/[\n,]/);

  const prIsBehindOnAProjectItIsChanging = projectDirectories?.some(
    dir => fileNamesWhichBranchIsBehindOn.some(file => file.includes(dir)) && changedFileNames?.some(file => file.includes(dir))
  );

  if (prIsBehindOnAProjectItIsChanging) {
    return `This branch has one or more outdated projects. Please update with ${default_branch}.`;
  }
};
