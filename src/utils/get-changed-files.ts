import * as github from '@actions/github';
import * as core from '@actions/core';
import { octokit } from '../octokit';

export enum ChangeType {
  add,
  edit,
  delete,
  any
}

export interface Change {
  file: string;
  changeType: ChangeType;
  patch: string;
}

export async function getChangedFiles(eventName: string | undefined): Promise<Change[]> {
  if (!eventName) {
    return [];
  }

  switch (eventName) {
    case 'push':
      return getChangesFromSha();
    default:
      return getChangesFromPR();
  }
}

async function getChangesFromSha(): Promise<Change[]> {
  const beforeSha = github.context.payload.before;
  const afterSha = github.context.payload.after;
  const owner = github.context.payload.repository?.owner?.name;
  const repo = github.context.payload.repository?.name;

  if (!beforeSha || !afterSha || !repo || !owner) {
    return [];
  }

  const changedFiles = await octokit.repos.compareCommits({
    owner,
    repo,
    base: beforeSha,
    head: afterSha,
    mediaType: { format: 'sha' }
  });

  const changes: Change[] = changedFiles.data.files!.map(f => ({
    file: f.filename,
    changeType: parseStatus(f.status),
    patch: f.patch!
  }));

  core.debug('found changed files:');
  for (const change of changes) {
    core.debug(`  ${change.file}`);
  }

  return changes;
}

async function getChangesFromPR(): Promise<Change[]> {
  const pullRequest = github.context.payload.pull_request;
  if (!pullRequest) {
    return [];
  }

  const listFilesResponse = await octokit.pulls.listFiles({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: pullRequest.number
  });

  const changes = listFilesResponse.data.map(f => ({
    file: f.filename,
    changeType: parseStatus(f.status),
    patch: f.patch!
  }));

  core.debug('found changed files:');
  for (const change of changes) {
    core.debug(`  ${change.file}`);
  }

  return changes;
}

function parseStatus(status: string): ChangeType {
  switch (status) {
    case 'added':
      return ChangeType.add;
    case 'removed':
      return ChangeType.delete;
    case 'modified':
      return ChangeType.edit;
    default:
      return ChangeType.edit;
  }
}
