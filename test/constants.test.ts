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

import { GITHUB_OPTIONS } from '../src/constants';

describe('constants', () => {
  it('should produce correct github options', () => {
    expect(GITHUB_OPTIONS).toEqual({
      headers: {
        accept:
          'application/vnd.github.ant-man-preview+json,application/vnd.github.flash-preview+json,application/vnd.github.groot-preview+json,application/vnd.github.inertia-preview+json,application/vnd.github.starfox-preview+json'
      }
    });
  });
});
