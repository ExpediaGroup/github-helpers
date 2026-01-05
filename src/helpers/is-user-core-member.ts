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

import { HelperInputs } from '../types/generated';
import { context } from '@actions/github';
import * as core from '@actions/core';
import { getCoreMemberLogins } from '../utils/get-core-member-logins';

export class IsUserCoreMember extends HelperInputs {}

export const isUserCoreMember = async ({ pull_number, login = context.actor, codeowners_overrides }: IsUserCoreMember) => {
  const pullNumber = Number(pull_number);
  const coreMembers = await getCoreMemberLogins({ pull_number: pullNumber, codeowners_overrides });
  core.info(`Checking if ${login} is a core member for pull request ${pullNumber}`);
  core.info(`Core members: ${coreMembers.join(', ')}`);
  return coreMembers.includes(login);
};
