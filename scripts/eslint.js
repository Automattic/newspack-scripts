'use strict';

const spawn = require( 'cross-spawn' );
const modules = require( './utils/modules' );
const utils = require( './utils/index.js' );
const wpScripts = require.resolve( '@wordpress/scripts/bin/wp-scripts' );

utils.log( 'Linting JS…' );

const args = process.argv.slice( 2 );

const result = spawn.sync(
	wpScripts,
	[
		'lint-js',
		...args,
	],
	{
		cwd: modules.rootDirectory,
		stdio: 'inherit',
		env: { ...process.env, NODE_ENV: 'development' },
	}
);

process.exit( result.status );
