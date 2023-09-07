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
import { DEFAULT_PIPELINE_STATUS } from '../../src/constants';
import { context } from '@actions/github';
import { notifyPipelineComplete } from '../../src/helpers/notify-pipeline-complete';
import { octokit } from '../../src/octokit';
jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
    context: { repo: { repo: 'repo', owner: 'owner' } },
    getOctokit: jest.fn(() => ({
        rest: {
            pulls: { list: jest.fn() },
            repos: { createCommitStatus: jest.fn() }
        }
    }))
}));
jest.mock('../../src/helpers/set-deployment-status');
octokit.pulls.list.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        data: [{ head: { sha: 'sha 1' } }, { head: { sha: 'sha 2' } }, { head: { sha: 'sha 3' } }]
    });
}));
describe('setOpenPullRequestStatus', () => {
    const description = 'Pipeline clear.';
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield notifyPipelineComplete({});
    }));
    it('should call list with correct params', () => {
        expect(octokit.pulls.list).toHaveBeenCalledWith(Object.assign({ state: 'open', per_page: 100 }, context.repo));
    });
    it('should call createCommitStatus with correct params', () => {
        expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith(Object.assign({ sha: 'sha 1', context: DEFAULT_PIPELINE_STATUS, state: 'success', description }, context.repo));
        expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith(Object.assign({ sha: 'sha 2', context: DEFAULT_PIPELINE_STATUS, state: 'success', description }, context.repo));
        expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith(Object.assign({ sha: 'sha 3', context: DEFAULT_PIPELINE_STATUS, state: 'success', description }, context.repo));
    });
});
//# sourceMappingURL=notify-pipeline-complete.test.js.map