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

export class HelperInputs {
  helper?: string;
  github_token?: string;
  body?: string;
  project_name?: string;
  project_destination_column_name?: string;
  note?: string;
  project_origin_column_name?: string;
  sha?: string;
  context?: string;
  state?: string;
  description?: string;
  target_url?: string;
  environment?: string;
  environment_url?: string;
  label?: string;
  labels?: string;
  paths?: string;
  extensions?: string;
  override_filter_paths?: string;
  batches?: string;
  pattern?: string;
  teams?: string;
  login?: string;
  paths_no_filter?: string;
  slack_webhook_url?: string;
  number_of_assignees?: string;
  globs?: string;
  override_filter_globs?: string;
  title?: string;
  seconds?: string;
  pull_number?: string;
  base?: string;
  head?: string;
  days?: string;
  no_evict_upon_conflict?: string;
  skip_if_already_set?: string;
  repo?: string;
  owner?: string;
}
