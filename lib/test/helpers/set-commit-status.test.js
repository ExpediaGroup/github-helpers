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
import { context as githubContext } from '@actions/github';
import { octokit } from '../../src/octokit';
import { setCommitStatus } from '../../src/helpers/set-commit-status';
jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
    context: { repo: { repo: 'repo', owner: 'owner' } },
    getOctokit: jest.fn(() => ({
        rest: {
            repos: { createCommitStatus: jest.fn() },
            checks: {
                listForRef: jest.fn(() => ({
                    data: {
                        check_runs: [
                            { name: 'context1', status: 'completed', conclusion: 'success' },
                            { name: 'context2', status: 'completed', conclusion: 'skipped' },
                            { name: 'context3', status: 'completed', conclusion: 'failure' }
                        ]
                    }
                }))
            }
        }
    }))
}));
describe('setCommitStatus', () => {
    const sha = 'sha';
    const state = 'success';
    const description = 'desc';
    const target_url = 'url';
    describe('single context', () => {
        const context = 'context';
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield setCommitStatus({
                sha,
                context,
                state,
                description,
                target_url
            });
        }));
        it('should call createCommitStatus with correct params', () => {
            expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith(Object.assign({ sha,
                context,
                state,
                description,
                target_url }, githubContext.repo));
        });
    });
    describe('multiple contexts', () => {
        const context = 'context1\ncontext2';
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield setCommitStatus({
                sha,
                context,
                state,
                description,
                target_url
            });
        }));
        it('should call createCommitStatus with correct params', () => {
            expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith(Object.assign({ sha, context: 'context1', state,
                description,
                target_url }, githubContext.repo));
            expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith(Object.assign({ sha, context: 'context2', state,
                description,
                target_url }, githubContext.repo));
        });
    });
    describe('ignore whitespace in context', () => {
        const context = 'context1\n\ncontext2';
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield setCommitStatus({
                sha,
                context,
                state,
                description,
                target_url
            });
        }));
        it('should skip blank line', () => {
            expect(octokit.repos.createCommitStatus).toHaveBeenCalledTimes(2);
        });
    });
    describe('skip_if_already_set set to true', () => {
        it('should skip as existing check run exited properly', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setCommitStatus({
                sha,
                context: 'context1',
                state,
                description,
                target_url,
                skip_if_already_set: 'true'
            });
            expect(octokit.repos.createCommitStatus).not.toHaveBeenCalled();
        }));
        it('should set status as check was skipped', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setCommitStatus({
                sha,
                context: 'context2',
                state,
                description,
                target_url,
                skip_if_already_set: 'true'
            });
            expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith(Object.assign({ sha, context: 'context2', state,
                description,
                target_url }, githubContext.repo));
        }));
        it('should handle multiple inputs and only set the applicable status', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setCommitStatus({
                sha,
                context: 'context3\ncontext2',
                state,
                description,
                target_url,
                skip_if_already_set: 'true'
            });
            expect(octokit.repos.createCommitStatus).toHaveBeenCalledTimes(1);
            expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith(Object.assign({ sha, context: 'context2', state,
                description,
                target_url }, githubContext.repo));
        }));
    });
});
//# sourceMappingURL=set-commit-status.test.js.map