'use strict';

const spawn = require( 'cross-spawn' );
const utils = require( './utils/index.js' );
const tsc = require.resolve( 'typescript/bin/tsc' );

utils.log( 'Starting TypeScript check…' );

const result = spawn.sync( tsc, [], {
	stdio: 'inherit',
} );

if ( result.status === 0 ) {
	utils.log( 'All good!' );
}

process.exit( result.status );
