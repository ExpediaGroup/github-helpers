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
import * as core from '@actions/core';
import { octokit } from '../octokit';
import { paginateAllOpenPullRequests } from '../utils/paginate-open-pull-requests';
import { SECONDS_IN_A_DAY } from '../constants';
import { createPrComment } from './create-pr-comment';
import { closePr } from './close-pr';

export class StalePrs extends HelperInputs {
  declare days?: string;
  declare exempt_labels?: string;
  declare stale_label?: string;
  declare close_label?: string;
  declare stale_comment?: string;
  declare close_comment?: string;
  declare operations_per_run?: string;
  declare ascending?: string;
  declare only_labels?: string;
  declare exempt_authors?: string;
  declare exempt_draft_pr?: string;
  declare remove_stale_when_updated?: string;
  declare days_before_close?: string;
}

export const stalePrs = async ({
  days = '30',
  exempt_labels = '',
  stale_label = 'stale',
  close_label = '',
  stale_comment = 'This pull request has been automatically marked as stale because it has not had recent activity. It will be closed if no further activity occurs.',
  close_comment = 'This pull request has been automatically closed due to inactivity.',
  operations_per_run = '30',
  ascending = 'false',
  only_labels = '',
  exempt_authors = '',
  exempt_draft_pr = 'true',
  remove_stale_when_updated = 'true',
  days_before_close = ''
}: StalePrs = {}) => {
  const staleDays = Number(days);
  const maxOperations = Number(operations_per_run);
  const isAscending = ascending.toLowerCase() === 'true';
  const exemptDraftPr = exempt_draft_pr.toLowerCase() === 'true';
  const removeStaleWhenUpdated = remove_stale_when_updated.toLowerCase() === 'true';
  const daysBeforeClose = days_before_close ? Number(days_before_close) : null;

  const exemptLabelsList = exempt_labels
    .split(',')
    .map(label => label.trim())
    .filter(Boolean);
  const onlyLabelsList = only_labels
    .split(',')
    .map(label => label.trim())
    .filter(Boolean);
  const exemptAuthorsList = exempt_authors
    .split(',')
    .map(author => author.trim())
    .filter(Boolean);

  core.info(`Checking for stale PRs older than ${staleDays} days...`);

  const openPullRequests = await paginateAllOpenPullRequests();

  // Sort PRs by updated date
  openPullRequests.sort((a, b) => {
    const dateA = new Date(a.updated_at).getTime();
    const dateB = new Date(b.updated_at).getTime();
    return isAscending ? dateA - dateB : dateB - dateA;
  });

  // Filter PRs based on criteria
  const candidatePrs = openPullRequests.filter(pr => {
    // Skip draft PRs if configured
    if (exemptDraftPr && pr.draft) {
      return false;
    }

    // Skip PRs from exempt authors
    if (exemptAuthorsList.length > 0 && exemptAuthorsList.includes(pr.user?.login || '')) {
      return false;
    }

    return true;
  });

  let operationsCount = 0;
  const processedPrs: { number: number; action: 'staled' | 'closed' | 'skipped' | 'unstaled'; reason?: string }[] = [];

  // First pass: Remove stale labels from recently updated PRs
  if (removeStaleWhenUpdated) {
    const stalePrs = candidatePrs.filter(pr => {
      const prLabels = pr.labels?.map(label => (typeof label === 'string' ? label : label.name)) || [];
      return prLabels.includes(stale_label);
    });

    for (const pr of stalePrs) {
      if (operationsCount >= maxOperations) break;

      const daysSinceUpdate = getDaysSinceLastUpdate(pr.updated_at);

      // If PR was updated recently (less than stale days), remove stale label
      if (daysSinceUpdate < staleDays) {
        core.info(`Removing stale label from PR #${pr.number} (recently updated: ${daysSinceUpdate} days ago)`);

        try {
          await octokit.issues.removeLabel({
            ...context.repo,
            issue_number: pr.number,
            name: stale_label
          });
        } catch {
          // Ignore if label doesn't exist
        }

        processedPrs.push({ number: pr.number, action: 'unstaled', reason: 'recently updated' });
        operationsCount++;
      }
    }
  }

  for (const pr of candidatePrs) {
    if (operationsCount >= maxOperations) {
      break;
    }

    const prLabels = pr.labels?.map(label => (typeof label === 'string' ? label : label.name)) || [];

    // Check if PR has exempt labels
    if (exemptLabelsList.length > 0 && exemptLabelsList.some(label => prLabels.includes(label))) {
      processedPrs.push({ number: pr.number, action: 'skipped', reason: 'exempt label' });
      continue;
    }

    // Check if PR should only be processed if it has specific labels
    if (onlyLabelsList.length > 0 && !onlyLabelsList.some(label => prLabels.includes(label))) {
      processedPrs.push({ number: pr.number, action: 'skipped', reason: 'missing required label' });
      continue;
    }

    const daysSinceUpdate = getDaysSinceLastUpdate(pr.updated_at);
    const isStale = daysSinceUpdate >= staleDays;
    const hasStaleLabel = prLabels.includes(stale_label);
    const hasCloseLabel = close_label && prLabels.includes(close_label);

    // Check if PR should be closed based on days_before_close
    const shouldAutoClose = daysBeforeClose && hasStaleLabel && daysSinceUpdate >= staleDays + daysBeforeClose;

    if (!isStale && !hasStaleLabel) {
      processedPrs.push({ number: pr.number, action: 'skipped', reason: 'not stale' });
      continue;
    }

    // Auto-close stale PRs that have exceeded the close threshold
    if (shouldAutoClose) {
      core.info(`Auto-closing stale PR #${pr.number} (stale for ${daysSinceUpdate - staleDays} days)`);
      await closePr({
        body: close_comment,
        pull_number: pr.number.toString()
      });
      processedPrs.push({ number: pr.number, action: 'closed', reason: 'auto-close after stale period' });
      operationsCount++;
      continue;
    }

    // If PR has close label, close it
    if (hasCloseLabel) {
      core.info(`Closing PR #${pr.number} due to close label...`);
      await closePr({
        body: close_comment,
        pull_number: pr.number.toString()
      });
      processedPrs.push({ number: pr.number, action: 'closed', reason: 'close label' });
      operationsCount++;
      continue;
    }

    // If PR is stale but doesn't have stale label, add it and comment
    if (isStale && !hasStaleLabel) {
      core.info(`Marking PR #${pr.number} as stale (${daysSinceUpdate} days old)...`);

      // Add stale label
      await octokit.issues.addLabels({
        ...context.repo,
        issue_number: pr.number,
        labels: [stale_label]
      });

      // Add stale comment
      if (stale_comment) {
        await createPrComment({
          body: stale_comment,
          pull_number: pr.number.toString()
        });
      }

      processedPrs.push({ number: pr.number, action: 'staled' });
      operationsCount++;
    }
  }

  const summary = {
    total_processed: processedPrs.length,
    staled: processedPrs.filter(pr => pr.action === 'staled').length,
    closed: processedPrs.filter(pr => pr.action === 'closed').length,
    skipped: processedPrs.filter(pr => pr.action === 'skipped').length,
    unstaled: processedPrs.filter(pr => pr.action === 'unstaled').length,
    operations_performed: operationsCount
  };

  core.info(`Stale PR processing complete: ${JSON.stringify(summary)}`);

  return {
    summary,
    processed_prs: processedPrs
  };
};

const getDaysSinceLastUpdate = (updatedAt: string): number => {
  const lastUpdated = new Date(updatedAt);
  const now = Date.now();
  const timeSinceLastUpdate = now - lastUpdated.getTime();
  return Math.floor(timeSinceLastUpdate / SECONDS_IN_A_DAY);
};
