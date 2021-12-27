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

import { components, operations } from '@octokit/openapi-types/types';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types';

export type PipelineState = operations['repos/create-commit-status']['requestBody']['content']['application/json']['state'];
export type DeploymentState = operations['repos/create-deployment-status']['requestBody']['content']['application/json']['state'];
export type PullRequest = components['schemas']['pull-request'];
export type SimplePullRequest = components['schemas']['pull-request-simple'];
export type PullRequestListResponse = RestEndpointMethodTypes['pulls']['list']['response'];
export type PullRequestSearchResults = RestEndpointMethodTypes['search']['issuesAndPullRequests']['response']['data']['items'];
export type CreateDeploymentResponse = components['schemas']['deployment'];
export type ProjectListResponse = RestEndpointMethodTypes['projects']['listForRepo']['response'];
export type ColumnListResponse = RestEndpointMethodTypes['projects']['listColumns']['response'];

export type ActionInputs = {
  [input: string]: string;
};
