![Release](https://github.com/ExpediaGroup/github-helpers/workflows/Release/badge.svg)

# github-helpers

#### A collection of Github Actions that simplify and standardize common CI/CD workflow tasks.

## Usage

### General

```yaml
uses: ExpediaGroup/github-helpers@v1
with:
    helper: <HELPER NAME>
```

The `helper` input is required for all helpers, and the `github_token` input defaults to the included workflow token `${{ github.token }}`. Additional inputs vary by helper. Each helper file in `src/helpers` contains an interface that defines which additional inputs are required or optional. If a required input is ommitted, the helper will throw a descriptive error.

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
```

## Available Helpers

Each of the following helpers are defined in a file of the same name in `src/helpers`:

### [are-reviewers-required](.github/workflows/are-reviewers-required.yml)

-   Returns true if all teams specified are requested for review on a pull request

### [add-labels](.github/workflows/add-labels.yml)

-   Adds one or more labels to a PR

### [add-late-review-label](.github/workflows/add-late-review-label.yml)

-   Adds a `LATE REVIEW` label to all PRs that are open and waiting for review for over a certain number of days

### [add-pr-approval-label](.github/workflows/add-pr-approval-label.yml)

-   Upon PR review, adds a `CORE APPROVED` label if the reviewer is a part of the provided Github team, otherwise adds the `PEER APPROVED` label

### [approvals-satisfied](.github/workflows/approvals-satisfied.yml)

-   Returns `true` if the PR has been approved by the specified GitHub team(s) and `false` otherwise
-   If GitHub teams are omitted, uses `CODEOWNERS.md` to determine teams to use

### [approve-pr](.github/workflows/approve-pr.yml)

-   Approves a PR

### [assign-pr-reviewers](.github/workflows/assign-pr-reviewers.yml)

-   Randomly assigns members of the specified GitHub team(s) to review a PR.
-   If GitHub teams are omitted, uses `CODEOWNERS.md` to determine teams to use
-   If `login` is provided, it does nothing if that user is already part of the team
-   You can also pass a `slack_webhook_url` to notify the assignees that they are assigned to the PR!

### [check-merge-safety](.github/workflows/check-merge-safety.yml)

-   Checks if a PR branch needs to update with the default branch prior to merging (great for monorepos!)
-   If this check succeeds for a PR, the PR is safe to merge right away!
-   If this check fails for a PR, the PR must either merge in the default branch or rebase onto the default branch.

"Merge safety" is defined as a PR's branch being up to date with all files that could impact the validity of the PR checks that run.
This merge safety check is designed to be a smarter alternative to GitHub's "[require branches to be up to date before merging](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches#require-status-checks-before-merging)"
branch protection rule.

The below table (taken from the above link) outlines the current branch protection rule settings GitHub provides:

| Type of required status check | Setting                                                                       | Merge requirements                                                             | Considerations                                                                                                                                                                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Strict                        | The Require branches to be up to date before merging checkbox is checked.     | The branch must be up to date with the base branch before merging.             | This is the default behavior for required status checks. More builds may be required, as you'll need to bring the head branch up to date after other collaborators merge pull requests to the protected base branch.                               |
| Loose                         | The Require branches to be up to date before merging checkbox is not checked. | The branch does not have to be up to date with the base branch before merging. | You'll have fewer required builds, as you won't need to bring the head branch up to date after other collaborators merge pull requests. Status checks may fail after you merge your branch if there are incompatible changes with the base branch. |

The "Strict" option is too strict! It opens the door to needless additional PR check runs when a PR is updated
with commits that changes files completely unrelated to the scope of the PR's change.

The "Loose" option is too loose! There are times when a commit is made to the default branch that renders PR checks
stale (specifically when files are changed that could impact the result of builds or tests).

The `check-merge-safety` helper offers a middle-ground between the "Strict" and "Loose" options, giving us the best of
both worlds! Using this helper allows us to uncheck the "Require branches to be up to date before merging" checkbox
while forcing PRs to incorporate the latest relevant changes into the CI process. This way, we can ensure that
only the _necessary_ iterations of PR check runs occur, allowing contributors touching unrelated parts of the codebase
to ship code in quick succession!

This workflow should be run on both `pull_request` and `push` events:

-   On `pull_request` events, this serves as a PR check
-   On `push` events, this effectively re-runs this PR check for all open PRs and sets a commit status according to the result

The following parameters can be used for additional control over when it is safe to merge a PR:

-   `paths`: These are the file paths to all of a repo's projects (usually paths to standalone packages)
    -   This is useful for monorepos with multiple projects which are decoupled from each other but are affected by global dependencies.
-   `ignore_globs`: These are glob patterns that, if out of date on a PR, will not prevent merge
    -   example: `ignore_globs: **.md`
-   `override_filter_paths`: These are the file paths that, if out of date on a PR, will prevent merge no matter what files the PR is changing
    -   example: `override_filter_paths: package.json,package-lock.json`
-   `override_filter_globs`: These are glob patterns for `override_filter_paths`

### [close-pr](.github/workflows/close-pr.yml)

-   Closes a pull request

### [create-pr](.github/workflows/create-pr.yml)

-   Opens a pull request

### [create-project-card](.github/workflows/create-project-card.yml)

-   Creates a Project card into your GitHub Project repository by providing a `project_name` and `project_destination_column_name` in which the card should be created.
-   If `note` is provided, it will add that information into the card. If it is not provided, it will use the PR information details to populate it.
-   Useful when opening a pull request and want to track its information details into a GitHub Project.

### [check-pr-title](.github/workflows/check-pr-title.yml)

-   Checks whether PR title matches a certain regular expression

### [create-pr-comment](.github/workflows/create-pr-comment.yml)

-   Comments on a pull request or other issue

### [delete-stale-branches](.github/workflows/delete-stale-branches.yml)

-   Deletes all of a repository's unprotected branches not associated with an open PR and which have been inactive for a certain number of days

### [delete-deployment](.github/workflows/deployments.yml#L53)

-   Deletes a Github [deployment](https://docs.github.com/en/rest/reference/repos#deployments) and [environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#about-environments)

### [filter-paths](.github/workflows/filter-paths.yml)

-   Returns `true` if specified file paths have changed for a PR, and `false` otherwise

### [generate-matrix](.github/workflows/generate-matrix.yml)

-   Returns a job matrix JSON for dynamically running workflows

### [generate-path-matrix](.github/workflows/generate-path-matrix.yml)

-   Returns a job matrix JSON for dynamically running workflows only for changed file paths
-   Can be used to parallelize similar jobs, which can be useful in a monorepo environment. More information on matrix strategies can be found [here](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix)
-   In this example, a multi-package repo splits its builds dynamically based on which packages are modified in the pull request. These builds run in parallel, and the final `build-status` job is used to determine the overall success/failure result, contingent on all of the individual `build` jobs passing. The helper returns a JSON object of this format:

```json
{
    "include": [{ "path": "package-name" }]
}
```

Additionally, the following parameters can be used for additional control over the resulting matrix:

-   `override_filter_paths` defines paths that, if modified, will override the filter and return a matrix including all packages
    -   example: `override_filter_paths: package.json,package-lock.json`
-   `paths_no_filter` defines paths that should be included in the matrix regardless of if they've been modified
-   `batches` defines a fixed number of matrix jobs to run for the workflow

### [get-changed-files](.github/workflows/get-changed-files.yml)

-   Returns a comma-separated list of changed files for a PR
-   Include the regular expression parameter 'pattern' to add a filter, it will return any filepath that matches.

### [get-merge-base](.github/workflows/get-merge-base.yml)

-   Get merge base commit SHA for a PR

### [initiate-deployment](.github/workflows/deployments.yml#L12)

-   Creates a new in-progress Github "deployment" for a commit. More information on Github deployment events can be found [here](https://docs.github.com/en/rest/reference/repos#deployments)

### [is-user-in-team](.github/workflows/is-user-in-team.yml)

-   Checks if the specifed GitHub user exists within an organization team

### [manage-issue-due-dates](.github/workflows/manage-issue-due-dates.yml)

-   Adds a comment listing the due date (based on SLA guidelines) to issues with a priority label attached
-   Adds a &#x27;due soon&#x27; label to issues with a priority label that will become overdue in 7 days
-   Adds an &#x27;overdue&#x27; label to issues with a priority label that are overdue

### [manage-merge-queue](.github/workflows/manage-merge-queue.yml)

-   Manages a queue for PRs as follows:
    -   Adding the `READY TO MERGE` label to a PR will add the PR to the "merge queue", represented by a `QUEUED FOR MERGE #X` label. Removing `READY TO MERGE` will remove this label and thus remove the PR from the queue.
    -   If a PR is first in the queue, the `QUEUE CHECKER` commit status will be set to `success`, and it will be `pending` otherwise. Github's [branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/managing-a-branch-protection-rule) can be used to ensure this requirement is met prior to merging.
    -   Merging a PR will update the positions of all PRs in the queue.
    -   Adding the `JUMP THE QUEUE` label to a PR will make that PR first in the queue immediately.
    -   When a PR is merged, it automatically updates the first-queued PR with the default branch.
-   You can also pass `login` and `slack_webhook_url` to notify the PR author when they are in the 1st position of the merge queue.
-   Passing `skip_auto_merge: true` changes the default behaviour of automatically enabling auto-merge for PRs from the merge queue. In such case auto-merging should be enabled manually on individual PRs. It can be useful to avoid unattended deployments in case of CICD pipelines which are not fully prepared for continuous deployment.
### [move-project-card](.github/workflows/move-project-card.yml)

-   Moves a GitHub Project card to a new column, using the `project_origin_column_name` and`project_destination_column_name` you provide.
-   In order to move a card from one place to another, it must already exist.

### [notify-pipeline-complete](.github/workflows/notify-pipeline-complete.yml)

-   Sets a "pipeline" commit status to green for all open PRs

### [prepare-queued-pr-for-merge](.github/workflows/prepare-queued-pr-for-merge.yml)

-   Merges the default branch into the pull request that has the `QUEUED FOR MERGE #1` label

### [remove-label](.github/workflows/remove-label.yml)

-   Removes a label from a PR

### [remove-pr-from-merge-queue](.github/workflows/remove-pr-from-merge-queue.yml)

-   Removes a PR from the merge queue if it has a stale failing status check. A PR check is considered stale if it is older than the provided number of `seconds`.

### [rerun-pr-checks](.github/workflows/rerun-pr-checks.yml)

-   Reruns all of the latest workflow checks on a pull request (helpful if they were cancelled for some reason, either manually or due to rate limiting, for example).

### [set-commit-status](.github/workflows/set-commit-status.yml)

-   Sets a [commit status](https://github.blog/2012-09-04-commit-status-api/)
-   You can pass in `skip_if_already_set: true` if you'd like to skip setting a status if it's already been set on the commit by a workflow

### [set-deployment-status](.github/workflows/deployments.yml#L31)

-   Updates a Github [deployment status](https://docs.github.com/en/rest/reference/repos#deployments)

### [set-latest-pipeline-status](.github/workflows/set-latest-pipeline-status.yml)

-   Determines whether the pipeline is clear for a PR. This means it will set the "pipeline" commit status to `pending` if there is an in-progress production deployment for the repo, and `success` otherwise.

### [update-check-result](.github/workflows/update-check-result.yml)
-
- Updates the result of a previous PR check tied to a commit status.

## Legal

This project is available under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html).

Copyright 2021 Expedia, Inc.
