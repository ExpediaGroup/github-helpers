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
import { assignPrReviewers } from '../../src/helpers/assign-pr-reviewers';
import { context } from '@actions/github';
import { getCoreMemberLogins } from '../../src/utils/get-core-member-logins';
import { notifyUser } from '../../src/utils/notify-user';
import { octokit } from '../../src/octokit';
import { sampleSize } from 'lodash';
import { CORE_APPROVED_PR_LABEL, PEER_APPROVED_PR_LABEL } from '../../src/constants';
jest.mock('../../src/utils/get-core-member-logins');
jest.mock('../../src/utils/notify-user');
jest.mock('@actions/core');
jest.mock('lodash');
jest.mock('@actions/github', () => ({
    context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
    getOctokit: jest.fn(() => ({
        rest: {
            issues: { addAssignees: jest.fn(() => __awaiter(void 0, void 0, void 0, function* () { return 'result'; })) },
            pulls: { get: jest.fn() }
        }
    }))
}));
getCoreMemberLogins.mockResolvedValue(['user1', 'user2', 'user3']);
sampleSize.mockReturnValue(['assignee']);
describe('assignPrReviewer', () => {
    const teams = 'team1\nteam2';
    const pull_number = 123;
    beforeEach(() => {
        octokit.pulls.get.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                data: {
                    id: 1,
                    number: 123,
                    state: 'open',
                    title: 'feat: added feature to project',
                    user: {
                        login: 'author'
                    }
                }
            });
        }));
    });
    describe('login provided', () => {
        describe('core member case', () => {
            const login = 'user1';
            beforeEach(() => {
                assignPrReviewers({ login, teams });
            });
            it('should call getCoreMemberLogins with correct params', () => {
                expect(getCoreMemberLogins).toHaveBeenCalledWith(pull_number, ['team1', 'team2']);
            });
            it('should not call addAssignees', () => {
                expect(octokit.issues.addAssignees).not.toHaveBeenCalled();
            });
        });
        describe('not core member case', () => {
            const login = 'user4';
            beforeEach(() => {
                assignPrReviewers({ login, teams });
            });
            it('should call addAssignees with correct params', () => {
                expect(octokit.issues.addAssignees).toHaveBeenCalledWith(Object.assign({ assignees: ['assignee'], issue_number: 123 }, context.repo));
            });
        });
        describe('author is a core member', () => {
            const login = 'user6';
            beforeEach(() => {
                octokit.pulls.get.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
                    return ({
                        data: {
                            id: 1,
                            number: 123,
                            state: 'open',
                            title: 'feat: added feature to project',
                            user: {
                                login: 'user1'
                            }
                        }
                    });
                }));
                assignPrReviewers({ login, teams });
            });
            it('should not include author in the assignees list', () => {
                expect(sampleSize).toHaveBeenCalledWith(['user2', 'user3'], 1);
            });
        });
        describe('already core approved', () => {
            const login = 'user6';
            beforeEach(() => {
                octokit.pulls.get.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
                    return ({
                        data: {
                            id: 1,
                            number: 123,
                            state: 'open',
                            title: 'feat: added feature to project',
                            user: {
                                login: 'user1'
                            },
                            labels: [
                                {
                                    name: CORE_APPROVED_PR_LABEL
                                }
                            ]
                        }
                    });
                }));
                assignPrReviewers({ login, teams });
            });
            it('should not call addAssignees', () => {
                expect(octokit.issues.addAssignees).not.toHaveBeenCalled();
            });
        });
        describe('not core approved', () => {
            const login = 'user6';
            beforeEach(() => {
                octokit.pulls.get.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
                    return ({
                        data: {
                            id: 1,
                            number: 123,
                            state: 'open',
                            title: 'feat: added feature to project',
                            user: {
                                login: 'user1'
                            },
                            labels: [
                                {
                                    name: PEER_APPROVED_PR_LABEL
                                }
                            ]
                        }
                    });
                }));
                assignPrReviewers({ login, teams });
            });
            it('should call addAssignee', () => {
                expect(sampleSize).toHaveBeenCalledWith(['user2', 'user3'], 1);
            });
        });
        describe('override pull_number', () => {
            const login = 'user4';
            const pull_number_2 = '456';
            beforeEach(() => {
                assignPrReviewers({ login, teams, pull_number: pull_number_2 });
            });
            it('pull_number should come from the argument', () => {
                expect(octokit.issues.addAssignees).toHaveBeenCalledWith(Object.assign({ assignees: ['assignee'], issue_number: 456 }, context.repo));
            });
        });
    });
    describe('login not provided', () => {
        beforeEach(() => {
            assignPrReviewers({ teams });
        });
        it('should call addAssignees with correct params', () => {
            expect(octokit.issues.addAssignees).toHaveBeenCalledWith(Object.assign({ assignees: ['assignee'], issue_number: 123 }, context.repo));
        });
    });
    describe('slack url provided', () => {
        const slack_webhook_url = 'url';
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield assignPrReviewers({ teams, slack_webhook_url });
        }));
        it('should call notifyUser with correct params', () => {
            expect(notifyUser).toHaveBeenCalledWith({
                login: 'assignee',
                pull_number,
                slack_webhook_url
            });
        });
    });
});
//# sourceMappingURL=assign-pr-reviewers.test.js.map