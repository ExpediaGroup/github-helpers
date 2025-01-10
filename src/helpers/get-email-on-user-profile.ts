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
import { octokit } from '../octokit';
import { setFailed } from '@actions/core';

export class GetEmailOnUserProfile extends HelperInputs {
  login = '';
  pattern?: string;
}

export const getEmailOnUserProfile = async ({ login, pattern }: GetEmailOnUserProfile) => {
  const {
    data: { email }
  } = await octokit.users.getByUsername({ username: login });

  if (pattern && email && !new RegExp(pattern).test(email)) {
    setFailed(
      `Email ${email} does not match regex pattern ${pattern}. Please update the email on your GitHub profile to match this pattern!`
    );
    return;
  }

  return email;
};
