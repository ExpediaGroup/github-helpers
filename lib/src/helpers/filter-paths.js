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
import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import micromatch from 'micromatch';
import { octokit } from '../octokit';
export class FilterPaths extends HelperInputs {
}
export const filterPaths = ({ paths, globs }) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield octokit.pulls.listFiles(Object.assign({ per_page: 100, pull_number: context.issue.number }, context.repo));
    const fileNames = data.map(file => file.filename);
    if (globs) {
        if (paths)
            core.info('`paths` and `globs` inputs found, defaulting to use `globs` for filtering');
        return micromatch(fileNames, globs.split('\n')).length > 0;
    }
    else if (paths) {
        const filePaths = paths.split('\n');
        return fileNames.some(changedFile => filePaths.some(filePath => changedFile.startsWith(filePath)));
    }
    else {
        core.error('Must pass `globs` or `paths` for filtering');
    }
});
//# sourceMappingURL=filter-paths.js.map