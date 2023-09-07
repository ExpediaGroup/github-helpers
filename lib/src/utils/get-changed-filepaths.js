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
import { octokit } from '../octokit';
export const getChangedFilepaths = (pull_number) => __awaiter(void 0, void 0, void 0, function* () {
    const changedFiles = yield paginateAllChangedFilepaths(pull_number);
    return changedFiles.map(file => file.filename);
});
const paginateAllChangedFilepaths = (pull_number, page = 1) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield octokit.pulls.listFiles(Object.assign({ pull_number, per_page: 100, page }, context.repo));
    if (!response.data.length) {
        return [];
    }
    return response.data.concat(yield paginateAllChangedFilepaths(pull_number, page + 1));
});
//# sourceMappingURL=get-changed-filepaths.js.map