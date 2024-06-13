const path = require( 'path' );
require( '@wordpress/browserslist-config' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = ( ...args ) => {
	let config = { ...defaultConfig };

	// Merge config extensions into default config.
	args.forEach( extension => {
		config = { ...config, ...extension };
	} );

	// Help resolve the browserslist config.
	// config.target = 'browserslist:' + browserslistConfig;

	// Ensure that webpack resolves modules from the Newspack Scripts node_modules as well as the root repo's node_modules.
	config.resolve.modules = [
		path.resolve( 'node_modules/newspack-scripts/node_modules' ),
		'node_modules',
	];

	// Clear cacheGroups so that CSS files don't get the `style-` prefix.
	if ( config?.optimization?.splitChunks?.cacheGroups?.style ) {
		delete config.optimization.splitChunks.cacheGroups.style;
	}

	// const scssRuleIndex = config.module.rules.findIndex( rule =>
	// 	rule.test.toString().match( /\(sc\|sa\|c\)ss/ )
	// );
	// if ( scssRuleIndex !== -1 ) {
	// 	const scssRule = config.module.rules[ scssRuleIndex ];
	// 	const postCssLoaderIndex = scssRule.use.findIndex(
	// 		loader => loader.loader && loader.loader.indexOf( 'postcss' ) > 0
	// 	);
	// 	if ( postCssLoaderIndex !== -1 ) {
	// 		const postCssLoader = scssRule.use[ postCssLoaderIndex ];
	// 		const postCssConfigPath = path.resolve( __dirname, 'postcss.config.js' );

	// 		// Replace calypso-build's PostCSS config with this project's one.
	// 		postCssLoader.options.postcssOptions.config = postCssConfigPath;
	// 		config.module.rules[ scssRuleIndex ].use[
	// 			postCssLoaderIndex
	// 		] = postCssLoader;
	// 	}
	// }
	return config;
};
