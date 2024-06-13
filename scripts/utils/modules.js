const fs = require( 'fs' );
const path = require( 'path' );

const rootDirectory = fs.realpathSync( process.cwd() );

module.exports = {
	rootDirectory,
	args: cmd => (
		[
			cmd,
			'--config',
			'webpack.config.js',
			'--output-path',
			'dist',
		]
	),
};
