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

// These extra headers are for experimental API features on Github Enterprise. See https://docs.github.com/en/enterprise-server@3.0/rest/overview/api-previews for details.
const PREVIEWS = ['ant-man', 'flash', 'groot', 'inertia', 'starfox'];
export const GITHUB_OPTIONS = {
  headers: {
    accept: PREVIEWS.map(preview => `application/vnd.github.${preview}-preview+json`).join()
  }
};

export const SECONDS_IN_A_DAY = 86400000;
export const DEFAULT_EXEMPT_DESCRIPTION = 'Passed in case the check is exempt.';
export const DEFAULT_PIPELINE_STATUS = 'Pipeline Status';
export const DEFAULT_PIPELINE_DESCRIPTION = 'Pipeline clear.';
export const PRODUCTION_ENVIRONMENT = 'production';
export const LATE_REVIEW = 'Late Review';
export const OVERDUE_ISSUE = 'Overdue';
export const ALMOST_OVERDUE_ISSUE = 'Due Soon';
export const PRIORITY_1 = 'Priority: Critical';
export const PRIORITY_2 = 'Priority: High';
export const PRIORITY_3 = 'Priority: Medium';
export const PRIORITY_4 = 'Priority: Low';
export const CORE_APPROVED_PR_LABEL = 'CORE APPROVED';
export const PEER_APPROVED_PR_LABEL = 'PEER APPROVED';
export const READY_FOR_MERGE_PR_LABEL = 'READY FOR MERGE';
export const MERGE_QUEUE_STATUS = 'QUEUE CHECKER';
export const QUEUED_FOR_MERGE_PREFIX = 'QUEUED FOR MERGE';
export const FIRST_QUEUED_PR_LABEL = `${QUEUED_FOR_MERGE_PREFIX} #1`;
export const JUMP_THE_QUEUE_PR_LABEL = 'JUMP THE QUEUE';
export const DEFAULT_PR_TITLE_REGEX = '^(build|ci|chore|docs|feat|fix|perf|refactor|style|test|revert|Revert|BREAKING CHANGE)((.*))?: .+$';
export const COPYRIGHT_HEADER = `/*
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
*/`;
