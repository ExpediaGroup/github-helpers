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

import * as core from '@actions/core';
import { Octokit } from '@octokit/core';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import { retry } from '@octokit/plugin-retry';
import { logging } from './logging';

const githubToken = core.getInput('github_token', { required: true });

const MyOctokit = Octokit.plugin(restEndpointMethods, retry, logging);

const octokitInstance = new MyOctokit({
  auth: githubToken
});

export const octokit = octokitInstance.rest;
export const octokitGraphql = octokitInstance.graphql;
