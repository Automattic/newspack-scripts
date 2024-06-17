'use strict';

/**
 * Run a command via newspack-script's dependencies.
 * Usage: newspack-scripts proxy <command> [args]
 */

const path = require( 'path' );
const spawn = require( 'cross-spawn' );
const modules = require( './utils/modules' );
const utils = require( './utils/index.js' );

const args = process.argv.slice( 2 );
const dependency = args.shift();
const cmd = path.resolve( __dirname, `../node_modules/.bin/${ dependency }` );

utils.log( `Running command: ${ dependency } ${ args.join( ' ' ) }` );

const result = spawn.sync(
	cmd,
	args,
	{
		cwd: modules.rootDirectory,
		stdio: 'inherit',
		env: { ...process.env, NODE_ENV: 'semantic-release' === cmd ? 'production' : 'development' },
	}
);

process.exit( result.status );
