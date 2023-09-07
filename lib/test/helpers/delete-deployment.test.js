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
import { GITHUB_OPTIONS } from '../../src/constants';
import { context } from '@actions/github';
import { deleteDeployment } from '../../src/helpers/delete-deployment';
import { octokit } from '../../src/octokit';
jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
    context: { repo: { repo: 'repo', owner: 'owner' } },
    getOctokit: jest.fn(() => ({
        rest: {
            repos: {
                createDeploymentStatus: jest.fn(),
                deleteDeployment: jest.fn(),
                deleteAnEnvironment: jest.fn(),
                listDeployments: jest.fn()
            }
        }
    }))
}));
describe('deleteDeployment', () => {
    const sha = 'sha';
    const environment = 'environment';
    const deployment_id = 123;
    describe('deployment exists', () => {
        beforeEach(() => {
            octokit.repos.listDeployments.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
                return ({
                    data: [
                        {
                            id: deployment_id
                        },
                        {
                            id: 456
                        }
                    ]
                });
            }));
            deleteDeployment({
                sha,
                environment
            });
        });
        it('should call listDeployments with correct params', () => {
            expect(octokit.repos.listDeployments).toHaveBeenCalledWith(Object.assign(Object.assign({ sha,
                environment }, context.repo), GITHUB_OPTIONS));
        });
        it('should call createDeploymentStatus with correct params', () => {
            expect(octokit.repos.createDeploymentStatus).toHaveBeenCalledWith(Object.assign(Object.assign({ state: 'inactive', deployment_id }, context.repo), GITHUB_OPTIONS));
        });
        it('should call deleteDeployment with correct params', () => {
            expect(octokit.repos.deleteDeployment).toHaveBeenCalledWith(Object.assign(Object.assign({ deployment_id }, context.repo), GITHUB_OPTIONS));
        });
        it('should call deleteAnEnvironment with correct params', () => {
            expect(octokit.repos.deleteAnEnvironment).toHaveBeenCalledWith(Object.assign(Object.assign({ environment_name: environment }, context.repo), GITHUB_OPTIONS));
        });
    });
    describe('deployment does not exist', () => {
        beforeEach(() => {
            octokit.repos.listDeployments.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
                return ({
                    data: []
                });
            }));
            deleteDeployment({
                sha,
                environment
            });
        });
        it('should call listDeployments with correct params', () => {
            expect(octokit.repos.listDeployments).toHaveBeenCalledWith(Object.assign(Object.assign({ sha,
                environment }, context.repo), GITHUB_OPTIONS));
        });
        it('should not call createDeploymentStatus', () => {
            expect(octokit.repos.createDeploymentStatus).not.toHaveBeenCalled();
        });
        it('should not call deleteDeployment', () => {
            expect(octokit.repos.deleteDeployment).not.toHaveBeenCalled();
        });
        it('should not call deleteAnEnvironment', () => {
            expect(octokit.repos.deleteAnEnvironment).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=delete-deployment.test.js.map