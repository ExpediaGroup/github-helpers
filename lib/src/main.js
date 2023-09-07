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
import { camelCase, upperFirst } from 'lodash';
import { getActionInputs } from './utils/get-action-inputs';
export const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const helper = core.getInput('helper', { required: true });
        const { [camelCase(helper)]: method, [upperFirst(camelCase(helper))]: HelperInterface } = yield import(`./helpers/${helper}`);
        const requiredInputs = HelperInterface ? Object.keys(new HelperInterface()) : [];
        const actionInputs = getActionInputs(requiredInputs);
        const output = yield method(actionInputs);
        core.setOutput('output', output);
    }
    catch (error) {
        core.setFailed(error);
    }
});
run();
//# sourceMappingURL=main.js.map