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

import { describe, it, expect, Mock, beforeEach } from 'bun:test';
import { setupMocks } from '../setup';

setupMocks();

const { getChangedFiles } = await import('../../src/helpers/get-changed-files');
const { octokit } = await import('../../src/octokit');
const { context } = await import('@actions/github');

const mock_data1 = [
  {
    sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
    filename: 'file/path/1/file1.txt',
    status: 'added',
    additions: 103,
    deletions: 21,
    changes: 124,
    blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
    patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
  },
  {
    sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
    filename: 'something/totally/different/file1.txt',
    status: 'added',
    additions: 103,
    deletions: 21,
    changes: 124,
    blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
    patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
  }
] as const;
const mock_data2 = [
  {
    sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
    filename: 'file/path/2/file2.txt',
    status: 'added',
    additions: 103,
    deletions: 21,
    changes: 124,
    blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
    patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
  }
] as const;
const mock_data3 = [
  {
    sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
    filename: 'file/path/1/file1.txt',
    status: 'added',
    additions: 103,
    deletions: 21,
    changes: 124,
    blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
    patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
  },
  {
    sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
    filename: 'something/deleted/file/file2.txt',
    status: 'removed',
    additions: 103,
    deletions: 21,
    changes: 124,
    blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
    patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
  }
] as const;
const mock_data4 = [
  {
    sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
    filename: 'file/path/1/file1.txt',
    status: 'added',
    additions: 103,
    deletions: 21,
    changes: 124,
    blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
    patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
  },
  {
    sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
    filename: 'something/renamed/file/file2.txt',
    status: 'renamed',
    additions: 103,
    deletions: 21,
    changes: 124,
    blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
    contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
    patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test',
    previous_filename: 'original/file/location/file2.txt'
  }
] as const;
(octokit.pulls.listFiles as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
  data: page === 1 ? mock_data1 : page === 2 ? mock_data2 : []
}));

describe('getChangedFiles', () => {
  it('case where one of the file paths match the file paths that octokit returns', async () => {
    const result = await getChangedFiles({});

    expect(result).toEqual([mock_data1[0].filename, mock_data1[1].filename, mock_data2[0].filename].join(','));
  });

  it('case where files returned from getChangedFiles matches the provided regex pattern', async () => {
    const result = await getChangedFiles({ pattern: 'file/path/1/file[0-9].txt' });

    expect(result).toEqual(mock_data1[0].filename);
  });

  it('case where files returned from getChangedFiles does not match the provided regex pattern', async () => {
    const result = await getChangedFiles({ pattern: 'a/fake/path/arandotex.test' });

    expect(result).toEqual('');
  });

  it('should ignore deleted files when ignore_deleted input is provided', async () => {
    (octokit.pulls.listFiles as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
      data: page === 1 ? mock_data3 : []
    }));
    const result = await getChangedFiles({ ignore_deleted: 'true' });

    expect(result).toEqual(mock_data3[0].filename);
  });

  it('should include original location of renamed files, as if rename was an addition and deletion', async () => {
    (octokit.pulls.listFiles as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
      data: page === 1 ? mock_data4 : []
    }));
    const result = await getChangedFiles({ ignore_deleted: 'true' });

    expect(result).toEqual([mock_data4[0].filename, mock_data4[1].filename, mock_data4[1].previous_filename].join(','));
  });

  it('should handle merge queue case', async () => {
    context.eventName = 'merge_group';
    context.ref = 'refs/heads/gh-readonly-queue/default-branch/pr-12345-f0d9a4cb862b13cdaab6522f72d6dc17e4336b7f';
    (octokit.pulls.listFiles as unknown as Mock<any>).mockImplementation(
      async ({ page, pull_number }: { page: number; pull_number: number }) => ({
        data: pull_number === 12345 && page === 1 ? mock_data4 : []
      })
    );
    const result = await getChangedFiles({});

    expect(result).toEqual([mock_data4[0].filename, mock_data4[1].filename, mock_data4[1].previous_filename].join(','));
  });

  it('should use pull_number input over merge queue pull number', async () => {
    context.eventName = 'merge_group';
    context.ref = 'refs/heads/gh-readonly-queue/default-branch/pr-12345-f0d9a4cb862b13cdaab6522f72d6dc17e4336b7f';
    (octokit.pulls.listFiles as unknown as Mock<any>).mockImplementation(
      async ({ page, pull_number }: { page: number; pull_number: number }) => ({
        data: pull_number === 456 && page === 1 ? mock_data2 : []
      })
    );

    const result = await getChangedFiles({ pull_number: '456' });

    expect(result).toEqual(mock_data2[0].filename);
  });
});

describe('getChangedFiles (push event)', () => {
  const COMMIT_1 = { sha: 'commit-sha-aaa' };
  const COMMIT_2 = { sha: 'commit-sha-bbb' };

  const push_file_added = {
    sha: 'sha1',
    filename: 'src/feature/added.ts',
    status: 'added',
    additions: 10,
    deletions: 0,
    changes: 10,
    blob_url: '',
    raw_url: '',
    contents_url: ''
  };
  const push_file_modified = {
    sha: 'sha2',
    filename: 'src/feature/modified.ts',
    status: 'modified',
    additions: 5,
    deletions: 2,
    changes: 7,
    blob_url: '',
    raw_url: '',
    contents_url: ''
  };
  const push_file_removed = {
    sha: 'sha3',
    filename: 'src/old/removed.ts',
    status: 'removed',
    additions: 0,
    deletions: 20,
    changes: 20,
    blob_url: '',
    raw_url: '',
    contents_url: ''
  };

  beforeEach(() => {
    context.eventName = 'push';
    context.payload = { before: 'before-sha', after: 'after-sha' };
  });

  it('returns files changed in a single commit', async () => {
    (octokit.repos.compareCommitsWithBasehead as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
      data: { commits: page === 1 ? [COMMIT_1] : [] }
    }));
    (octokit.repos.getCommit as unknown as Mock<any>).mockImplementation(async () => ({
      data: { files: [push_file_added, push_file_modified] }
    }));

    const result = await getChangedFiles({});

    expect(result).toEqual([push_file_added.filename, push_file_modified.filename].join(','));
  });

  it('aggregates files from multiple commits', async () => {
    (octokit.repos.compareCommitsWithBasehead as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
      data: { commits: page === 1 ? [COMMIT_1, COMMIT_2] : [] }
    }));
    (octokit.repos.getCommit as unknown as Mock<any>).mockImplementation(async ({ ref }: { ref: string }) => ({
      data: { files: ref === COMMIT_1.sha ? [push_file_added] : [push_file_modified] }
    }));

    const result = await getChangedFiles({});

    expect(result).toEqual([push_file_added.filename, push_file_modified.filename].join(','));
  });

  it('paginates through commits across multiple pages', async () => {
    (octokit.repos.compareCommitsWithBasehead as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
      data: { commits: page === 1 ? [COMMIT_1] : page === 2 ? [COMMIT_2] : [] }
    }));
    (octokit.repos.getCommit as unknown as Mock<any>).mockImplementation(async ({ ref }: { ref: string }) => ({
      data: { files: ref === COMMIT_1.sha ? [push_file_added] : [push_file_modified] }
    }));

    const result = await getChangedFiles({});

    expect(result).toEqual([push_file_added.filename, push_file_modified.filename].join(','));
  });

  it('excludes removed files when ignore_deleted is set', async () => {
    (octokit.repos.compareCommitsWithBasehead as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
      data: { commits: page === 1 ? [COMMIT_1] : [] }
    }));
    (octokit.repos.getCommit as unknown as Mock<any>).mockImplementation(async () => ({
      data: { files: [push_file_added, push_file_removed] }
    }));

    const result = await getChangedFiles({ ignore_deleted: 'true' });

    expect(result).toEqual(push_file_added.filename);
  });

  it('filters files by pattern', async () => {
    (octokit.repos.compareCommitsWithBasehead as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
      data: { commits: page === 1 ? [COMMIT_1] : [] }
    }));
    (octokit.repos.getCommit as unknown as Mock<any>).mockImplementation(async () => ({
      data: { files: [push_file_added, push_file_modified] }
    }));

    const result = await getChangedFiles({ pattern: 'added' });

    expect(result).toEqual(push_file_added.filename);
  });

  it('deduplicates files across commits, keeping the last seen status', async () => {
    const push_file_later_removed = { ...push_file_added, status: 'removed' };
    (octokit.repos.compareCommitsWithBasehead as unknown as Mock<any>).mockImplementation(async ({ page }: { page: number }) => ({
      data: { commits: page === 1 ? [COMMIT_1, COMMIT_2] : [] }
    }));
    (octokit.repos.getCommit as unknown as Mock<any>).mockImplementation(async ({ ref }: { ref: string }) => ({
      data: { files: ref === COMMIT_1.sha ? [push_file_added] : [push_file_later_removed] }
    }));

    // file was added in commit 1 then removed in commit 2 — net status is removed, so excluded
    const result = await getChangedFiles({ ignore_deleted: 'true' });

    expect(result).toEqual('');
  });
});
