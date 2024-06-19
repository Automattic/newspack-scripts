#!/usr/bin/env node

const spawn = require( 'cross-spawn' );
const utils = require( '../scripts/utils/index.js' );

const [ scriptName, ...nodeArgs ] = process.argv.slice( 2 );

if (
	[
		'test',
		'commit',
		'commitlint',
		'release',
		'semantic-release',
		'typescript-check',
		'wp-scripts',
	].includes( scriptName )
) {
	const result = spawn.sync(
		process.execPath,
		[ require.resolve( '../scripts/' + scriptName ), ...nodeArgs ],
		{ stdio: 'inherit' }
	);
	if ( result.signal ) {
		if ( result.signal === 'SIGKILL' ) {
			utils.log(
				'The build failed because the process exited too early. ' +
          'This probably means the system ran out of memory or someone called ' +
          '`kill -9` on the process.'
			);
		} else if ( result.signal === 'SIGTERM' ) {
			utils.log(
				'The build failed because the process exited too early. ' +
          'Someone might have called `kill` or `killall`, or the system could ' +
          'be shutting down.'
			);
		}
		process.exit( 1 );
	}
	process.exit( result.status );
} else {
	utils.log( `Unknown script "${ scriptName }".` );
}
