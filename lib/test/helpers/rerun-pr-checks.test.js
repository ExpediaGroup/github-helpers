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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as core from '@actions/core';
import { context } from '@actions/github';
import { octokit } from '../../src/octokit';
import { request } from '@octokit/request';
import { rerunPrChecks } from '../../src/helpers/rerun-pr-checks';
jest.mock('@actions/core');
jest.mock('@octokit/request');
jest.mock('@actions/github', () => ({
    context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
    getOctokit: jest.fn(() => ({ rest: { pulls: { get: jest.fn() }, actions: { listWorkflowRunsForRepo: jest.fn() }, request: jest.fn() } }))
}));
const gh_token = 'gh token';
core.getInput.mockReturnValue(gh_token);
const prWorkflowRuns = {
    total_count: 5,
    workflow_runs: [
        {
            id: 1001,
            name: 'danger',
            head_sha: 'aef123',
            rerun_url: 'https://api.github.com/repos/owner/repo/actions/runs/1001/rerun'
        },
        {
            id: 1002,
            name: 'build',
            head_sha: 'aef123',
            rerun_url: 'https://api.github.com/repos/owner/repo/actions/runs/1002/rerun'
        },
        {
            id: 1003,
            name: 'danger',
            head_sha: 'efc459',
            rerun_url: 'https://api.github.com/repos/owner/repo/actions/runs/1003/rerun'
        }
    ]
};
const prTargetWorkflowRuns = {
    total_count: 5,
    workflow_runs: [
        {
            id: 1004,
            name: 'danger',
            head_sha: 'aef123',
            rerun_url: 'https://api.github.com/repos/owner/repo/actions/runs/1004/rerun'
        },
        {
            id: 1005,
            name: 'build',
            head_sha: 'aef123',
            rerun_url: 'https://api.github.com/repos/owner/repo/actions/runs/1005/rerun'
        },
        {
            id: 1006,
            name: 'danger',
            head_sha: 'efc459',
            rerun_url: 'https://api.github.com/repos/owner/repo/actions/runs/1006/rerun'
        }
    ]
};
octokit.actions.listWorkflowRunsForRepo.mockImplementation(({ event }) => __awaiter(void 0, void 0, void 0, function* () { return event === 'pull_request' ? { data: prWorkflowRuns } : { data: prTargetWorkflowRuns }; }));
const branch = 'branch';
const owner = 'owner';
const latestHash = 'aef123';
const pullsMockData = {
    head: {
        user: {
            login: owner
        },
        sha: latestHash,
        ref: branch
    }
};
octokit.pulls.get.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { return ({ data: pullsMockData }); }));
request.mockResolvedValue({ catch: jest.fn() });
describe('rerunPrChecks', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield rerunPrChecks();
    }));
    it('should rerun all the latest workflow runs', () => {
        expect(octokit.pulls.get).toHaveBeenCalledWith(Object.assign({ pull_number: 123 }, context.repo));
        expect(octokit.actions.listWorkflowRunsForRepo).toHaveBeenCalledWith({
            branch,
            repo: context.repo.repo,
            owner,
            event: 'pull_request',
            per_page: 100,
            status: 'completed'
        });
        expect(octokit.actions.listWorkflowRunsForRepo).toHaveBeenCalledWith({
            branch,
            repo: context.repo.repo,
            owner,
            event: 'pull_request_target',
            per_page: 100,
            status: 'completed'
        });
        expect(request).toHaveBeenCalledWith('POST https://api.github.com/repos/owner/repo/actions/runs/1001/rerun', {
            headers: {
                authorization: `token ${gh_token}`
            }
        });
        expect(request).toHaveBeenCalledWith('POST https://api.github.com/repos/owner/repo/actions/runs/1002/rerun', {
            headers: {
                authorization: `token ${gh_token}`
            }
        });
        expect(request).not.toHaveBeenCalledWith('POST https://api.github.com/repos/owner/repo/actions/runs/1003/rerun', {
            headers: {
                authorization: `token ${gh_token}`
            }
        });
        expect(request).toHaveBeenCalledWith('POST https://api.github.com/repos/owner/repo/actions/runs/1004/rerun', {
            headers: {
                authorization: `token ${gh_token}`
            }
        });
        expect(request).toHaveBeenCalledWith('POST https://api.github.com/repos/owner/repo/actions/runs/1005/rerun', {
            headers: {
                authorization: `token ${gh_token}`
            }
        });
        expect(request).not.toHaveBeenCalledWith('POST https://api.github.com/repos/owner/repo/actions/runs/1006/rerun', {
            headers: {
                authorization: `token ${gh_token}`
            }
        });
    });
});
//# sourceMappingURL=rerun-pr-checks.test.js.map