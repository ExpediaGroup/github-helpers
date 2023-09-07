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
import { checkPrTitle } from '../../src/helpers/check-pr-title';
import { octokit } from '../../src/octokit';
jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
    context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
    getOctokit: jest.fn(() => ({ rest: { pulls: { get: jest.fn() } } }))
}));
describe('checkPrTitle', () => {
    it('should pass as the PR title conforms to the regex', () => __awaiter(void 0, void 0, void 0, function* () {
        octokit.pulls.get.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                data: {
                    id: 1,
                    number: 123,
                    state: 'open',
                    title: 'feat: added feature to project'
                }
            });
        }));
        const result = yield checkPrTitle({});
        expect(result).toBe(true);
    }));
    it('should fail as the PR title does not conform to the regex', () => __awaiter(void 0, void 0, void 0, function* () {
        octokit.pulls.get.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                data: {
                    id: 1,
                    number: 123,
                    state: 'open',
                    title: 'this title will fail'
                }
            });
        }));
        const result = yield checkPrTitle({});
        expect(result).toBe(false);
    }));
});
//# sourceMappingURL=check-pr-title.test.js.map