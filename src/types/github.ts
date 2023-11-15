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

import { RestEndpointMethodTypes } from '@octokit/rest';

export type PipelineState = RestEndpointMethodTypes['repos']['createCommitStatus']['parameters']['state'];
export type DeploymentState = RestEndpointMethodTypes['repos']['createDeploymentStatus']['parameters']['state'];
export type PullRequest = RestEndpointMethodTypes['pulls']['get']['response']['data'];
export type PullRequestList = RestEndpointMethodTypes['pulls']['list']['response']['data'];
export type IssueList = RestEndpointMethodTypes['issues']['listForRepo']['response']['data'];
export type CommentList = RestEndpointMethodTypes['issues']['listComments']['response']['data'];
export type SingleComment = CommentList[number];
export type IssueAssignees = IssueList[number]['assignees'];
export type PullRequestReviewList = RestEndpointMethodTypes['pulls']['listReviews']['response']['data'];
export type SinglePullRequest = PullRequestList[number];
export type IssueLabels = IssueList[number]['labels'];
export type PullRequestBranchesList = RestEndpointMethodTypes['repos']['listBranches']['response']['data'];
export type ChangedFilesList = RestEndpointMethodTypes['pulls']['listFiles']['response']['data'];
export type ProjectListResponse = RestEndpointMethodTypes['projects']['listForRepo']['response'];
export type ColumnListResponse = RestEndpointMethodTypes['projects']['listColumns']['response'];

export type GithubError = {
  status: number;
  message: string;
};
