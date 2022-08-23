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

import { backstageExport } from '../../src/helpers/backstage-export';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'rainbow-bridge', owner: 'aurora-is-near' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({ rest: { pulls: { listFiles: jest.fn() } } }))
}));

describe('backstageExport', () => {
  describe('generates multisig info from a template', () => {
    it('multisigs.md', async () => {
      const result = await backstageExport({
        backstage_url: process.env.BACKSTAGE_URL,
        template_path: 'templates/backstage',
        output_path: 'tmp/backstage',
        testing: true
      });
      expect(result).toBeTruthy();
    });
  });
});
