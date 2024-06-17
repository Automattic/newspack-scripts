const fs = require( 'fs' );

const rootDirectory = fs.realpathSync( process.cwd() );

module.exports = {
	rootDirectory,
	args: ( cmd, opts = [] ) => {
		const defaults = [
			cmd,
			'--config',
			'webpack.config.js',
		];

		// Default build path: ./dist
		if ( ! opts.includes( '--output-path' ) ) {
			defaults.push( '--output-path', 'dist' );
		}

		return [ ...defaults, ...opts ];
	},
};
