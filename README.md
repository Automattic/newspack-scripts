# newspack-scripts

Scripts for Newspack, heavily inspired by [`react-scripts`](https://github.com/facebook/create-react-app/blob/main/packages/react-scripts).

---

## Available scripts

### test

Will run `jest` tests. Useful flags:

- `--watch` to run in file watch mode,
- `--coverage` to collect test coverage

### build

Will run `calypso-build`, creating optimised production builds.

### watch

Will run `calypso-build` in watch mode.

### commit

Uses [`commitizen`](https://www.npmjs.com/package/commitizen) to create a structured commit message.

### commitlint

Lints to commit message, to be used in a git `commit-msg` hook.

### release

Will run [`semantic-release`](semantic-release.gitbook.io/) based on a very opinionated configuration.

### typescript-check

Will validate TypeScript code in the project. This requires a `tsconfig.json` file to be placed in the project root. Example:

```json
{
  "extends": "newspack-scripts/config/tsconfig.json",
  "compilerOptions": {
    "rootDir": "src"
  },
  "include": ["src"]
}
```

---

## Semantic Release

This package contains a configuration of [`semantic-release`](semantic-release.gitbook.io/), which can be used for automated software releases, published on Github. It's configured to work with the following repository branch setup:

1. `trunk` – ongoing development
1. `alpha` – release candidate
1. `hotfix/*` - for testing urgent bugfixes
1. `epic/*` - for testing large-scale features
1. `release` – the production-ready, released code

The following assumes that CI will run:

1. `npm run release` for `release`, `alpha`, `hotfix/*`, and `epic/*` branches
1. `post-release.sh` script on `release` branch, after the above command completes

### Regular release flow

1. Create a new branch off the `trunk` branch.
1. Commit changes to your branch using [structured commit messages](https://www.conventionalcommits.org/en/v1.0.0/).
1. Open a pull request for review based on `trunk`. Changes must be tested and approved before merging.
1. Merge approved changes to the `trunk` branch. When merging into `trunk`, SQUASH the merge.
1. Merge `trunk` into `alpha` to create a release candidate (e.g. `1.2.0-alpha.1`). When merging `trunk` into `alpha`, DO NOT SQUASH the merge.
1. Merge `alpha` into `release` to create a production release (e.g. `1.2.0`). When merging `alpha` into `release`, DO NOT SQUASH the merge.
1. `alpha` branch will be reset on top of `release`.
1. `trunk` branch will be updated with the changes from the `release` branch.

### Epic feature release flow

For large-scale features that require more than one interdependent branch throughout development.

1. Create a new `epic/*` branch off the `trunk` branch. Push the branch to GitHub so all engineers can work off it simultaneously. **Keep this branch up-to-date with `trunk`, to minimize the risk of merge conflicts.**
1. Create new sub-branches off the epic branch. **Keep sub-branches up-to-date with the `epic/*` branch, to minimize the risk of merge conflicts.**
1. Commit changes to your sub-branches using [structured commit messages](https://www.conventionalcommits.org/en/v1.0.0/).
1. Open pull requests for review based on the `epic/*` branch. Changes must be tested and approved before merging.
1. Merge approved changes to the `epic/*` branch. When merging into `epic/*`, DO NOT SQUASH the merge.
1. A new "epic" pre-release (e.g. `1.2.0-epic-feature.1`) will be tagged and published when changes are merged via PR. Use epic releases for QA and other pre-release testing.
1. Once all features in the `epic/*` branch have been tested and approved, open a pull request for final review based on `trunk`. Final review doesn't require full-scale functional testing, only a review of the changeset (as changes have already been tested in individual PRs).
1. Merge the `epic/*` branch to the `trunk` branch. When merging an epic branch into `trunk`, SQUASH the merge.
1. Once `epic/*` has been merged to `trunk`, follow the regular release flow to generate release candidates and production releases.

### Hotfix release flow

1. Create a new `hotfix/*` branch off the `release` branch.
1. Commit changes to your branch using [structured commit messages](https://www.conventionalcommits.org/en/v1.0.0/).
1. Push the branch to Github, so the CI can process it – _don't create a PR just yet!\*_
1. A new "hotfix" pre-release (e.g. `1.2.0-hotfix.1`) will be tagged and published.
1. Open a pull request for review based on `release`. Changes must be tested and approved before merging.
1. Merge the hotfix branch into `release` to create a release. When merging a hotfix into `release`, SQUASH the merge.
1. `alpha` & `trunk` branches will be updated with the changes from the `release` branch.

\* `semantic-release` [will not release if the CI job was triggered by a PR](https://github.com/semantic-release/semantic-release/blob/971a5e0d16f1a32e117e9ce382a1618c8256d0d9/index.js#L48-L51)

---

## Available configs

This package exposes a couple of configuration files.

### Webpack

The `webpack.config.js` file should use this package's config-extending function:

```js
const getBaseWebpackConfig = require("newspack-scripts/config/getWebpackConfig");

const webpackConfig = getBaseWebpackConfig(
  { WP: true },
  {
    entry: {
      "some-script": "./src/some-script.js",
    },
  }
);

module.exports = webpackConfig;
```

### Babel

A basic `babel.config.js`:

```js
module.exports = (api) => {
  api.cache(true);
  return {
    extends: "newspack-scripts/config/babel.config.js",
  };
};
```

### eslint

Because of eslint's [issue](https://github.com/eslint/eslint/issues/3458) with resolving dependencies of extended configurations, a patch has to be used to use this config in a stand-alone fashion: install `@rushstack/eslint-patch` and set up the `.eslintrc.js` like so:

```js
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: ["./node_modules/newspack-scripts/config/eslintrc.js"],
  // Additional options…
};
```

### stylelint

Install `stylelint` via npm and reference this package's config file when running it, e.g.:

```shell
stylelint '**/*.scss' --syntax scss --config=./node_modules/newspack-scripts/config/stylelint.config.js
```

_Note: Due to issue with dependency resolving, you might end up a different version of `prettier` in project's `node_modules` and `node_modules/newspack-scripts/node_modules`. See https://github.com/Automattic/newspack-scripts/issues/1 for more information._

### TypeScript

See note about `typescript-check` script above.

---

## CircleCI Orb

This repository hosts a [CircleCI Orb](https://circleci.com/docs/2.0/orb-intro), in `/src` directory. An Orb is a re-usable configuration – here's an example of how to use it:

```yml
version: 2.1

orbs:
  newspack: newspack/newspack@1.0.0

workflows:
  version: 2
  all:
    jobs:
      - newspack/build
```

### Updating the Orb

To update the Orb, use [CircleCI's CLI's](https://circleci.com/docs/2.0/local-cli/) [`pack`](https://circleci-public.github.io/circleci-cli/circleci_orb_pack.html) and [`publish`](https://circleci-public.github.io/circleci-cli/circleci_orb_publish.html) commands:

```bash
# Replace the `version` at the end (e.g. 1.0.1)
circleci orb pack src/ > orb.yml && circleci orb publish orb.yml newspack/newspack@version
```

Note that before the first time updating you'll need to set the API key for CircleCI CLI by running `$ circleci setup`.

---

## Misc

### `@wordpress/*` packages

This project list [`@wordpress/*` packages](https://github.com/WordPress/gutenberg/tree/trunk/packages) as dependencies in order to provide them to consumers. In a project using `calypso-build` (e.g. a consumer of `newspack-scripts`), the `@wordpress/*` packages are sourced from WP Core, not `node_modules`. The packages should be included in `node_modules`, though, to be available in other environments – notably when running tests. See [Dependency Extraction Webpack Plugin](https://www.npmjs.com/package/@wordpress/dependency-extraction-webpack-plugin) for more information.
