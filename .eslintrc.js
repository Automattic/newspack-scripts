require( '@rushstack/eslint-patch/modern-module-resolution' );

module.exports = {
	extends: [ './config/eslintrc.js' ],
	ignorePatterns: [ 'node_modules' ],
	rules: {
		'@typescript-eslint/no-var-requires': 'off',
	},
};
