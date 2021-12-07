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

import { CORE_REVIEW_APPROVED_COLUMN, IN_REVIEW_COLUMN, QUEUED_FOR_REVIEW } from '../constants';
import { moveProjectCard } from './move-project-card';
import { removeLabel } from './remove-label';
interface MoveProjectCardProps {
  pull_number: number;
}

export const moveProjectCardToApproved = async ({ pull_number }: MoveProjectCardProps) => {
  const originColumn = IN_REVIEW_COLUMN;
  const destinationColumn = CORE_REVIEW_APPROVED_COLUMN;
  moveProjectCard({ pull_number, originColumn, destinationColumn }).then(() => {
    removeLabel({ pull_number: String(pull_number), label: QUEUED_FOR_REVIEW });
  });
};
