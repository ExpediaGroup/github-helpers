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
import { simpleGit } from 'simple-git';
import { octokit } from '../octokit';
import micromatch from 'micromatch';
import { GithubError, PullRequest } from '../types/github';
import { paginateAllOpenPullRequests } from '../utils/paginate-open-pull-requests';
import { map } from 'bluebird';
import { setCommitStatus } from './set-commit-status';
import * as core from '@actions/core';

const git = simpleGit();

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

  const { state, message } = await setMergeSafetyStatus(pullRequest, inputs);
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

const fetchSha = async (repoUrl: string, sha: string) => {
  try {
    await git.fetch(repoUrl, sha, { '--depth': 1 });
    core.info(`Fetched ${sha} from ${repoUrl}`);
  } catch (err) {
    core.info(`Failed to fetch ${sha} from ${repoUrl}: ${(err as GithubError).message}`);
    throw new Error(`Failed to fetch ${sha} from ${repoUrl}: ${(err as GithubError).message}`);
  }
};

const getDiffUsingGitCommand = async (repoUrl: string, baseSha: string, headSha: string): Promise<string[]> => {
  // update local repo copy
  await fetchSha(repoUrl, baseSha);
  await fetchSha(repoUrl, headSha);

  try {
    const diff = await git.diff(['--name-only', baseSha, headSha]);
    return (diff ?? '').split('\n').filter(Boolean);
  } catch (err) {
    core.error(`Failed to run local git diff for ${repoUrl}: ${(err as GithubError).message}`);
    throw new Error(`Failed to run local git diff for ${repoUrl}: ${(err as GithubError).message}`);
  }
};

type DiffRefs = PullRequest['base' | 'head'];
const getDiff = async (compareBase: DiffRefs, compareHead: DiffRefs, basehead: string) => {
  let changedFileNames: string[] = [];
  try {
    const { data: { files: changedFiles } = {}, status } = await octokit.repos.compareCommitsWithBasehead({
      ...githubContext.repo,
      basehead
    });
    if (status > 400) {
      throw { status };
    }
    changedFileNames = changedFiles?.map(file => file.filename) ?? [];
  } catch (err) {
    core.info(`Failed to fetch diff: ${(err as GithubError).message} Status: ${(err as GithubError).status}`);

    // diff too large error
    if ((err as GithubError)?.status === 406 || (err as GithubError)?.message.includes('diff is taking too long to generate')) {
      core.info(`Attempting to generate diff using local git command`);
      if (compareBase.repo?.html_url) {
        changedFileNames = await getDiffUsingGitCommand(compareBase.repo?.html_url, compareBase.sha, compareHead.sha);
      } else {
        core.error(`Could not fetch repo url to run local git diff`);
        throw err;
      }
    } else {
      throw err;
    }
  }
  return changedFileNames;
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
  const diffAgainstUserBranch = `${branchName}...${baseOwner}:${default_branch}`;
  let fileNamesWhichBranchIsBehindOn;
  try {
    fileNamesWhichBranchIsBehindOn = await getDiff(pullRequest.head, pullRequest.base, diffAgainstUserBranch);
  } catch (err) {
    const message = diffErrorMessage(diffAgainstUserBranch, (err as GithubError).message);
    core.error(message);
    return { state: 'failure', message } as const;
  }

  const truncatedRef = ref.length > maxBranchNameLength ? `${ref.substring(0, maxBranchNameLength)}...` : ref;
  const truncatedBranchName = `${username}:${truncatedRef}`;
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

  const diffAgainstDefaultBranch = `${baseOwner}:${default_branch}...${branchName}`;
  let changedFileNames;
  try {
    changedFileNames = await getDiff(pullRequest.base, pullRequest.head, diffAgainstDefaultBranch);
  } catch (err) {
    const message = diffErrorMessage(diffAgainstDefaultBranch, (err as GithubError).message);
    core.error(message);
    return { state: 'failure', message } as const;
  }

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

const diffErrorMessage = (basehead: string, message = '') =>
  `Failed to generate diff for ${basehead}. Please verify SHAs are valid and try again.${message ? `\nError: ${message}` : ''}`;

const buildSuccessMessage = (branchName: string) => `Branch ${branchName} is safe to merge!`;
