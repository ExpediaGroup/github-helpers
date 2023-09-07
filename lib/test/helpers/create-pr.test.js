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
import { context } from '@actions/github';
import { createPr } from '../../src/helpers/create-pr';
import { octokit } from '../../src/octokit';
jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
    context: { repo: { repo: 'repo', owner: 'owner' }, ref: 'refs/heads/source' },
    getOctokit: jest.fn(() => ({
        rest: {
            repos: { get: jest.fn(), merge: jest.fn() },
            pulls: { create: jest.fn() }
        }
    }))
}));
octokit.repos.get.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        data: {
            default_branch: 'default branch'
        }
    });
}));
octokit.pulls.create.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        data: {
            number: 100
        }
    });
}));
describe('createPr', () => {
    const title = 'title';
    const body = 'body';
    it('should call repos get with correct params', () => __awaiter(void 0, void 0, void 0, function* () {
        yield createPr({
            title,
            body
        });
        expect(octokit.repos.get).toHaveBeenCalledWith(Object.assign({}, context.repo));
    }));
    it('should call repos merge with correct params', () => __awaiter(void 0, void 0, void 0, function* () {
        yield createPr({
            title,
            body
        });
        expect(octokit.repos.merge).toHaveBeenCalledWith(Object.assign({ base: 'source', head: 'default branch' }, context.repo));
    }));
    it('should call create with correct params', () => __awaiter(void 0, void 0, void 0, function* () {
        yield createPr({
            title,
            body
        });
        expect(octokit.pulls.create).toHaveBeenCalledWith(Object.assign({ title, head: 'source', base: 'default branch', body, maintainer_can_modify: true, draft: undefined, issue: undefined }, context.repo));
    }));
    it('should return the pull number', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield createPr({
            title,
            body
        });
        expect(result).toBe(100);
    }));
    it('should create pull from specified head', () => __awaiter(void 0, void 0, void 0, function* () {
        const head = 'feature/abc';
        yield createPr({
            title,
            body,
            head
        });
        expect(octokit.pulls.create).toHaveBeenCalledWith(Object.assign({ title,
            head, base: 'default branch', body, maintainer_can_modify: true, draft: undefined, issue: undefined }, context.repo));
    }));
    it('should create pull onto specified base', () => __awaiter(void 0, void 0, void 0, function* () {
        const base = '1.x';
        yield createPr({
            title,
            body,
            base
        });
        expect(octokit.pulls.create).toHaveBeenCalledWith(Object.assign({ title, head: 'source', base,
            body, maintainer_can_modify: true, draft: undefined, issue: undefined }, context.repo));
        // Since the base was provided, the repos PR should not be called.
        expect(octokit.repos.get).not.toHaveBeenCalled();
    }));
});
//# sourceMappingURL=create-pr.test.js.map