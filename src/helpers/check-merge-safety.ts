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
import micromatch from 'micromatch';
import { PullRequest } from '../types/github';
import { paginateAllOpenPullRequests } from '../utils/paginate-open-pull-requests';
import { map } from 'bluebird';
import { setCommitStatus } from './set-commit-status';
import * as core from '@actions/core';

const maxBranchNameLength = 50;
export class CheckMergeSafety extends HelperInputs {
  context?: string;
  paths?: string;
  ignore_globs?: string;
  override_filter_paths?: string;
  override_filter_globs?: string;
}

export const checkMergeSafety = async (inputs: CheckMergeSafety) => {
  const isPrWorkflow = Boolean(githubContext.issue.number);
  if (!isPrWorkflow) {
    return handlePushWorkflow(inputs);
  }
  const { data: pullRequest } = await octokit.pulls.get({ pull_number: githubContext.issue.number, ...githubContext.repo });

  const { state, message } = await setMergeSafetyStatus(pullRequest as PullRequest, inputs);
  if (state === 'failure') {
    core.setFailed(message);
  }
};

const setMergeSafetyStatus = async (pullRequest: PullRequest, { context = 'Merge Safety', ...inputs }: CheckMergeSafety) => {
  const { state, message } = await getMergeSafetyStateAndMessage(pullRequest, inputs);
  const hasExistingFailureStatus = await checkForExistingFailureStatus(pullRequest, context);
  if (hasExistingFailureStatus && state === 'failure') {
    const {
      head: {
        ref,
        user: { login: username }
      }
    } = pullRequest;
    const truncatedRef = ref.length > maxBranchNameLength ? `${ref.substring(0, maxBranchNameLength)}...` : ref;
    const truncatedBranchName = `${username}:${truncatedRef}`;
    core.info(`Found existing failure status for ${truncatedBranchName}, skipping setting new status`);
  } else {
    await setCommitStatus({
      sha: pullRequest.head.sha,
      state,
      context,
      description: message,
      ...githubContext.repo
    });
  }

  return { state, message };
};

const handlePushWorkflow = async (inputs: CheckMergeSafety) => {
  const pullRequests = await paginateAllOpenPullRequests();
  const filteredPullRequests = pullRequests.filter(({ base, draft }) => !draft && base.ref === base.repo.default_branch);
  await map(filteredPullRequests, pullRequest => setMergeSafetyStatus(pullRequest as PullRequest, inputs));
};

const checkForExistingFailureStatus = async (pullRequest: PullRequest, context: string) => {
  const { data } = await octokit.repos.getCombinedStatusForRef({
    ...githubContext.repo,
    ref: pullRequest.head.sha
  });
  if (data.state === 'failure') {
    const existingContext = data.statuses.find(status => status.context === context);
    return Boolean(existingContext);
  }
  return false;
};

const getMergeSafetyStateAndMessage = async (
  pullRequest: PullRequest,
  { paths, ignore_globs, override_filter_paths, override_filter_globs }: CheckMergeSafety
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

  const branchName = `${username}:${ref}`;
  const truncatedRef = ref.length > maxBranchNameLength ? `${ref.substring(0, maxBranchNameLength)}...` : ref;
  const truncatedBranchName = `${username}:${truncatedRef}`;

  const {
    data: { files: filesWhichBranchIsBehindOn }
  } = await octokit.repos.compareCommitsWithBasehead({
    ...githubContext.repo,
    basehead: `${branchName}...${baseOwner}:${default_branch}`
  });
  const fileNamesWhichBranchIsBehindOn = filesWhichBranchIsBehindOn?.map(file => file.filename) ?? [];

  const globalFilesOutdatedOnBranch = override_filter_globs
    ? micromatch(fileNamesWhichBranchIsBehindOn, override_filter_globs.split(/[\n,]/))
    : override_filter_paths
    ? fileNamesWhichBranchIsBehindOn.filter(changedFile => override_filter_paths.split(/[\n,]/).includes(changedFile))
    : [];

  if (globalFilesOutdatedOnBranch.length) {
    core.error(buildErrorMessage(globalFilesOutdatedOnBranch, 'global files', truncatedBranchName));
    return {
      state: 'failure',
      message: `This branch has one or more outdated global files. Please update with ${default_branch}.`
    } as const;
  }

  const {
    data: { files: changedFiles }
  } = await octokit.repos.compareCommitsWithBasehead({
    ...githubContext.repo,
    basehead: `${baseOwner}:${default_branch}...${branchName}`
  });
  const changedFileNames = changedFiles?.map(file => file.filename);
  const changedFilesToIgnore = changedFileNames && ignore_globs ? micromatch(changedFileNames, ignore_globs.split(/[\n,]/)) : [];
  const filteredFileNames = changedFileNames?.filter(file => !changedFilesToIgnore.includes(file));
  const allProjectDirectories = paths?.split(/[\n,]/);

  const changedProjectsOutdatedOnBranch = allProjectDirectories?.filter(
    dir => fileNamesWhichBranchIsBehindOn.some(file => file.includes(dir)) && filteredFileNames?.some(file => file.includes(dir))
  );

  if (changedProjectsOutdatedOnBranch?.length) {
    core.error(buildErrorMessage(changedProjectsOutdatedOnBranch, 'projects', truncatedBranchName));
    return {
      state: 'failure',
      message: `This branch has one or more outdated projects. Please update with ${default_branch}.`
    } as const;
  }

  const safeMessage = buildSuccessMessage(truncatedBranchName);
  core.info(safeMessage);
  return {
    state: 'success',
    message: safeMessage
  } as const;
};

const buildErrorMessage = (paths: string[], pathType: 'projects' | 'global files', branchName: string) =>
  `
The following ${pathType} are outdated on branch ${branchName}

${paths.map(path => `* ${path}`).join('\n')}
`;

const buildSuccessMessage = (branchName: string) => `Branch ${branchName} is safe to merge!`;
