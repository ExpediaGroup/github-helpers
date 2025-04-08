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
  declare helper?: string;
  declare github_token?: string;
  declare body?: string;
  declare project_name?: string;
  declare project_destination_column_name?: string;
  declare note?: string;
  declare project_origin_column_name?: string;
  declare sha?: string;
  declare context?: string;
  declare state?: string;
  declare description?: string;
  declare target_url?: string;
  declare environment?: string;
  declare environment_url?: string;
  declare label?: string;
  declare labels?: string;
  declare paths?: string;
  declare ignore_globs?: string;
  declare override_filter_paths?: string;
  declare batches?: string;
  declare pattern?: string;
  declare teams?: string;
  declare users?: string;
  declare login?: string;
  declare paths_no_filter?: string;
  declare slack_webhook_url?: string;
  declare number_of_assignees?: string;
  declare number_of_reviewers?: string;
  declare globs?: string;
  declare override_filter_globs?: string;
  declare title?: string;
  declare seconds?: string;
  declare pull_number?: string;
  declare base?: string;
  declare head?: string;
  declare days?: string;
  declare no_evict_upon_conflict?: string;
  declare skip_if_already_set?: string;
  declare delimiter?: string;
  declare team?: string;
  declare ignore_deleted?: string;
  declare return_full_payload?: string;
  declare skip_auto_merge?: string;
  declare repo_name?: string;
  declare repo_owner_name?: string;
  declare load_balancing_sizes?: string;
  declare required_review_overrides?: string;
  declare codeowners_overrides?: string;
  declare max_queue_size?: string;
  declare allow_only_for_maintainers?: string;
  declare use_basic_matrix_configuration?: string;
  declare merge_queue_enabled?: string;
  declare packages?: string;
}
