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
import * as fetch from '@adobe/node-fetch-retry';
import { Octokit } from '@octokit/rest';
import { getOctokit } from '@actions/github';

const githubToken = core.getInput('github_token', { required: true });
export const octokit = getOctokit(githubToken, { request: { fetch } }).rest as unknown as Octokit;
