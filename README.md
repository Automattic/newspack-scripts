# newspack-scripts

Scripts for Newspack, heavily inspired by [`react-scripts`](https://github.com/facebook/create-react-app/blob/main/packages/react-scripts).

## Available scripts

### test

Will run `jest` tests. Useful flags:

- `--watch` to run in file watch mode,
- `--coverage` to collect test coverage

### build

Will run `calypso-build`, creating optimised production builds.

### start

Will run `calypso-build` in watch mode.

### commit

Uses [`commitizen`](https://www.npmjs.com/package/commitizen) to create a structured commit message.

## Available configs

This package exposes a couple of configuration files.

### webpack

The `webpack.config.js` file should use this package's config-extending function:

```js
const getBaseWebpackConfig = require( 'newspack-scripts/config/getWebpackConfig' );

const webpackConfig = getBaseWebpackConfig(
  { WP: true },
  {
    entry: {
      'some-script': './src/some-script.js'
    },
  }
);

module.exports = webpackConfig;
```

### babel

A basic `babel.config.js`:

```js
module.exports = api => {
  api.cache( true );
  return {
    extends: 'newspack-scripts/config/babel.config.js',
  };
};
```

### eslint

Because of eslint's [issue](https://github.com/eslint/eslint/issues/3458) with resolving dependencies of extended configurations, a patch has to be used to use this config in a stand-alone fashion: install `@rushstack/eslint-patch` and set up the `.eslintrc.js` like so:

```js
require( '@rushstack/eslint-patch/modern-module-resolution' );

module.exports = {
  extends: [ './node_modules/newspack-scripts/config/eslintrc.js' ],
  // Additional options…
};
```

### stylelint

Install `stylelint` via npm and reference this package's config file when running it, e.g.:

```shell
stylelint '**/*.scss' --syntax scss --config=./node_modules/newspack-scripts/config/stylelint.config.js
```

_Note: Due to issue with dependency resolving, you might end up a different version of `prettier` in project's `node_modules` and `node_modules/newspack-scripts/node_modules`. See https://github.com/Automattic/newspack-scripts/issues/1 for more information._
