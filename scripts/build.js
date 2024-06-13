'use strict';

const spawn = require( 'cross-spawn' );
const modules = require( './utils/modules' );
const utils = require( './utils/index.js' );
const wpScripts = require.resolve( '@wordpress/scripts/bin/wp-scripts' );

utils.log( 'Starting to build…' );

const buildResult = spawn.sync( wpScripts, modules.args( 'build' ), {
	cwd: modules.rootDirectory,
	stdio: 'inherit',
	env: { ...process.env, NODE_ENV: 'production' },
} );

if ( buildResult.status === 0 ) {
	utils.log( 'Build succeeded!' );
}

process.exit( buildResult.status );
