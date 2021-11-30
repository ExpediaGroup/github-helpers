# Contributing

We'd love to accept your patches and contributions to this project. There are just a few guidelines you need to follow which are described in detail below.

## How To Contribute

### 1. Fork this repo

You should create a fork of this project in your account and work from there. You can create a fork by clicking the fork button in GitHub.

### 2. One feature, one branch

Work for each new feature/issue should occur in its own branch. To create a new branch from the command line:

```shell
git checkout -b my-new-feature
```

where "my-new-feature" describes what you're working on.

### 3. Add tests for any bug fixes or new functionality

All functions must be tested with a unit test. Please follow the existing convention of one exported function per file with a corresponding file to test it. Run tests using `npm run test`, or using the [Jest CLI](https://jestjs.io/docs/cli).

There are also integration tests present in the [workflow](./.github/workflows) directory, which will actually run each Github Action using the code from this repository. This allows you to test your changes right within the pull request you make.

Unfortunately, Github Action projects cannot be run locally. You must rely on the unit and integration tests to run your code.

### 4. Check code style

Before opening a pull request, ensure that you have installed all dependencies so the pre-commit hooks will run.
These hooks will run ESLint according to the [.eslintrc.json](./.eslintrc.json),
style the code according to the [.prettierrc.json](./.prettierrc.json), and package the code into the `dist` directory which is required for Github Actions code.

### 5. Add documentation for new or updated functionality

Please review all of the .md files in this project to see if they are impacted by your change and update them accordingly.

### 6. Format Commits

This project uses [Semantic Release](https://github.com/semantic-release/semantic-release) for versioning. As such, commits need to follow the format: `<type>(<scope>): <short summary>`. All fields are required.

### 7. Submit Pull Request and describe the change

Push your changes to your branch and open a pull request against the parent repo on GitHub. The project administrators will review your pull request and respond with feedback.

## How Your Contribution Gets Merged

Upon Pull Request submission, your code will be reviewed by the maintainers. They will confirm at least the following:

- Tests run successfully (unit, coverage, integration, style).
- Contribution policy has been followed.

One (human) reviewer will need to sign off on your Pull Request before it can be merged.

### 8. Release to Github Marketplace

Once your change has been merged, a new release will be created to the repository. In order to allow others to consume this change, you will need to publish the change as a separate release to the Github Marketplace. Follow [these instructions](https://docs.github.com/en/actions/creating-actions/publishing-actions-in-github-marketplace) to do so.
