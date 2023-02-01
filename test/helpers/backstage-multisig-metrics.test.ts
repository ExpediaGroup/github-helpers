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

import { collectMultisigs } from '../../src/helpers/backstage-multisig-metrics';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'rainbow-bridge', owner: 'aurora-is-near' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({ rest: { pulls: { listFiles: jest.fn() } } }))
}));

describe('collectMultisigs', () => {
  it('returns data', async () => {
    const data = await collectMultisigs({
      backstage_url: process.env.BACKSTAGE_URL,
      output_path: 'tmp/backstage/data.json'
    });
    expect(data).toBeTruthy();
  });
});
