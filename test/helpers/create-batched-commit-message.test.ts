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

import { createBatchedCommitMessage } from '../../src/helpers/create-batched-commit-message';
import { context } from '@actions/github';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { payload: {} }
}));

describe('createBatchedCommitMessage', () => {
  beforeEach(() => {
    context.payload.commits = [
      {
        id: '1234567890abcdef',
        message: 'Fix issue (#1)',
        author: { name: 'John Doe', email: '' }
      },
      {
        id: '1234567891abcdef',
        message: 'Fix another issue (#2)',
        author: { name: 'Jane Doe', email: '' }
      }
    ];
  });
  it('should generate combined commit message', () => {
    const result = createBatchedCommitMessage();
    expect(result).toBe('Fix issue (#1) and Fix another issue (#2)');
  });
});

describe('createBatchedCommitMessage', () => {
  beforeEach(() => {
    context.payload.commits = [
      {
        id: '1234567890abcdef',
        message: 'Fix a really really really really really long issue (#1)',
        author: { name: 'John Doe', email: '' }
      },
      {
        id: '1234567891abcdef',
        message: 'Fix another really really really really really long issue (#2)',
        author: { name: 'Jane Doe', email: '' }
      }
    ];
  });
  it('should truncate the message', () => {
    const result = createBatchedCommitMessage();
    expect(result).toBe(
      'Fix a really really really really really long issu... (#1) and Fix another really really really really really lon... (#2)'
    );
  });
});
