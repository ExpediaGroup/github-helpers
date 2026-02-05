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
import { getOctokit } from '@actions/github';
import { Octokit } from '@octokit/core';
import type { RequestError } from '@octokit/request-error';
import type { EndpointOptions } from '@octokit/types';

const githubToken = core.getInput('github_token', { required: true });
export const { rest: octokit, graphql: octokitGraphql } = getOctokit(githubToken, {
  request: { fetch },
  plugins: [errorLoggingPlugin]
});

function errorLoggingPlugin(octokit: Octokit) {
  octokit.hook.error('request', async (error: RequestError | Error, options: EndpointOptions) => {
    const endpoint = `${options.method} ${options.url}`;
    core.error(`GitHub API Error: ${endpoint}`);
    core.error(`Message: ${error.message}`);

    if ('status' in error && error.status) {
      core.error(`Status: ${error.status}`);
    }

    if ('response' in error && error.response?.data) {
      core.error(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }

    throw error;
  });

  octokit.hook.before('request', async (options: EndpointOptions) => {
    const endpoint = `${options.method} ${options.url}`;
    core.info(`GitHub API call: ${endpoint}`);
  });
}
