'use strict';

/**
 * Run a command via newspack-script's dependencies.
 * Usage: newspack-scripts proxy <command> [args]
 */

const spawn = require( 'cross-spawn' );
const modules = require( './utils/modules' );
const utils = require( './utils/index.js' );

const args = process.argv.slice( 2 );
const dependency = args.shift();
const cmd = require.resolve( `${ dependency }/bin/${ dependency }` );

utils.log( `Running ${ dependency }…` );

const result = spawn.sync(
	cmd,
	args,
	{
		cwd: modules.rootDirectory,
		stdio: 'inherit',
		env: { ...process.env, NODE_ENV: 'production' },
	}
);

process.exit( result.status );
