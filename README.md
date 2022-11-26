![Release](https://github.com/ExpediaGroup/github-helpers/workflows/Release/badge.svg)

# github-helpers
#### A collection of Github Actions that simplify and standardize common CI/CD workflow tasks.

## Usage
### General
```yaml
uses: ExpediaGroup/github-helpers@v1
with:
  helper: < HELPER NAME >
  ...
  github_token: ${{ secrets.GITHUB_TOKEN }}
```

The `helper` and `github_token` inputs are required for all helpers. Additional inputs vary by helper. Each helper file in `src/helpers` contains an interface that defines which additional inputs are required or optional. If a required input is ommitted, the helper will throw a descriptive error.

### Example
Input interface in `src/helpers/set-commit-status.ts`:
```ts
export class SetCommitStatus {
    sha = ''; // required
    context = ''; // required
    state = ''; // required
    description?: string; // optional
    target_url?: string; // optional
}
```
Github Actions workflow invocation:
```yaml
uses: ExpediaGroup/github-helpers@v1
with:
  helper: set-commit-status
  sha: ${{ github.event.pull_request.head.sha }}
  context: My Context
  state: success
  description: My Description
  github_token: ${{ secrets.GITHUB_TOKEN }}
```

## Available Helpers
Each of the following helpers are defined in a file of the same name in `src/helpers`:
### [add-labels](.github/workflows/add-labels.yml)
  * Adds one or more labels to a PR

### [add-late-review-label](.github/workflows/add-late-review-label.yml)
  * Adds a `LATE REVIEW` label to all PRs that are open and waiting for review for over a certain number of days

### [add-pr-approval-label](.github/workflows/add-pr-approval-label.yml)
  * Upon PR review, adds a `CORE APPROVED` label if the reviewer is a part of the provided Github team, otherwise adds the `PEER APPROVED` label

### [approve-pr](.github/workflows/approve-pr.yml)
* Approves a PR

### [assign-pr-reviewers](.github/workflows/assign-pr-reviewers.yml)
  * Randomly assigns members of a github team to review a PR. If `login` is provided, it does nothing if that user is already part of the team
  * You can also pass a `slack_webhook_url` to notify the assignees that they are assigned to the PR!

### [check-merge-safety](.github/workflows/check-merge-safety.yml)
  * Checks if a PR branch needs to update with the default branch prior to merging (useful for monorepos)

### [create-pr](.github/workflows/create-pr.yml)
  * Opens a pull request

### [create-project-card](.github/workflows/create-project-card.yml)
  * Creates a Project card into your GitHub Project repository by providing a `project_name` and `project_destination_column_name` in which the card should be created.
  * If `note` is provided, it will add that information into the card. If it is not provided, it will use the PR information details to populate it.
  * Useful when opening a pull request and want to track its information details into a GitHub Project.

### [check-pr-title](.github/workflows/check-pr-title.yml)
  * Checks whether PR title matches a certain regular expression

### [create-pr-comment](.github/workflows/create-pr-comment.yml)
  * Comments on a pull request or other issue

### [delete-deployment](.github/workflows/deployments.yml#L53)
* Deletes a Github [deployment](https://docs.github.com/en/rest/reference/repos#deployments) and [environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#about-environments)

### [filter-paths](.github/workflows/filter-paths.yml)
  * Returns `true` if specified file paths have changed for a PR, and `false` otherwise

### [generate-path-matrix](.github/workflows/generate-path-matrix.yml)
  * Returns a job matrix JSON for dynamically running workflows only for changed file paths
  * Can be used to parallelize similar jobs, which can be useful in a monorepo environment. More information on matrix strategies can be found [here](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix)
  * In this example, a multi-package repo splits its builds dynamically based on which packages are modified in the pull request. These builds run in parallel, and the final `build-status` job is used to determine the overall success/failure result, contingent on all of the individual `build` jobs passing. The helper returns a JSON object of this format:

```json
{
  "include": [
    { "path": "package-name" }
  ]
}
```

Additionally, the following parameters can be used for additional control over the resulting matrix:

* `override_filter_paths` defines paths that, if modified, will override the filter and return a matrix including all packages
  * example: `override_filter_paths: package.json,package-lock.json`
* `paths_no_filter` defines paths that should be included in the matrix regardless of if they've been modified
* `batches` defines a fixed number of matrix jobs to run for the workflow


### [get-changed-files](.github/workflows/get-changed-files.yml)
  * Returns a comma-separated list of changed files for a PR

### [initiate-deployment](.github/workflows/deployments.yml#L12)
  * Creates a new in-progress Github "deployment" for a commit. More information on Github deployment events can be found [here](https://docs.github.com/en/rest/reference/repos#deployments)

### [manage-merge-queue](.github/workflows/manage-merge-queue.yml)
  * Manages a queue for PRs as follows:
    * Adding the `READY TO MERGE` label to a PR will add the PR to the "merge queue", represented by a `QUEUED FOR MERGE #X` label. Removing `READY TO MERGE` will remove this label and thus remove the PR from the queue.
    * If a PR is first in the queue, the `QUEUE CHECKER` commit status will be set to `success`, and it will be `pending` otherwise. Github's [branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/managing-a-branch-protection-rule) can be used to ensure this requirement is met prior to merging.
    * Merging a PR will update the positions of all PRs in the queue.
    * Adding the `JUMP THE QUEUE` label to a PR will make that PR first in the queue immediately.
    * When a PR is merged, it automatically updates the first-queued PR with the default branch.
 * You can also pass `login` and `slack_webhook_url` to notify the PR author when they are in the 1st position of the merge queue.

### [move-project-card](.github/workflows/move-project-card.yml)
* Moves a GitHub Project card to a new column, using the `project_origin_column_name` and`project_destination_column_name` you provide.
* In order to move a card from one place to another, it must already exist.

### [notify-pipeline-complete](.github/workflows/notify-pipeline-complete.yml)
  * Sets a "pipeline" commit status to green for all open PRs

### [prepare-queued-pr-for-merge](.github/workflows/prepare-queued-pr-for-merge.yml)
  * Merges the default branch into the pull request that has the `QUEUED FOR MERGE #1` label

### [remove-label](.github/workflows/remove-label.yml)
  * Removes a label from a PR

### [remove-pr-from-merge-queue](.github/workflows/remove-pr-from-merge-queue.yml)
* Removes a PR from the merge queue if it has a stale failing status check. A PR check is considered stale if it is older than the provided number of `seconds`.

### [rerun-pr-checks](.github/workflows/rerun-pr-checks.yml)
* Reruns all of the latest workflow checks on a pull request (helpful if they were cancelled for some reason, either manually or due to rate limiting, for example).

### [set-commit-status](.github/workflows/set-commit-status.yml)
  * Sets a [commit status](https://github.blog/2012-09-04-commit-status-api/)

### [set-deployment-status](.github/workflows/deployments.yml#L31)
  * Updates a Github [deployment status](https://docs.github.com/en/rest/reference/repos#deployments)

### [set-latest-pipeline-status](.github/workflows/set-latest-pipeline-status.yml)
  * Determines whether the pipeline is clear for a PR. This means it will set the "pipeline" commit status to `pending` if there is an in-progress production deployment for the repo, and `success` otherwise.

## Legal

This project is available under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html).

Copyright 2021 Expedia, Inc.
