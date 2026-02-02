import { mock } from 'bun:test';

// Set environment variable for @actions/core
process.env.INPUT_GITHUB_TOKEN = 'mock-token';

// Create a comprehensive octokit mock structure
const createOctokitMock = () => ({
  rest: {
    issues: {
      addLabels: mock(() => {}),
      removeLabel: mock(() => {}),
      createComment: mock(() => {}),
      update: mock(() => {}),
      get: mock(() => ({}))
    },
    pulls: {
      get: mock(() => ({})),
      create: mock(() => ({})),
      list: mock(() => ({})),
      merge: mock(() => ({})),
      update: mock(() => ({}))
    },
    repos: {
      get: mock(() => ({})),
      merge: mock(() => ({})),
      compareCommits: mock(() => ({})),
      listBranches: mock(() => ({})),
      getBranch: mock(() => ({})),
      deleteBranch: mock(() => {})
    },
    git: {
      getRef: mock(() => ({})),
      deleteRef: mock(() => {})
    }
  },
  graphql: mock(() => ({}))
});

mock.module('@actions/core', () => ({
  getInput: () => 'mock-token',
  setOutput: () => {},
  setFailed: () => {},
  info: () => {},
  warning: () => {},
  error: () => {},
  debug: () => {}
}));

mock.module('@actions/github', () => ({
  context: {
    repo: { repo: 'repo', owner: 'owner' },
    issue: { number: 123 },
    ref: 'refs/heads/main'
  },
  getOctokit: mock(() => createOctokitMock())
}));
