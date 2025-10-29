export default {
	'lint-staged': {
		'*.scss': 'npm run lint:scss:staged',
		'*.(js|jsx)': 'npm run lint:js:staged',
		'*.(ts|tsx)': 'npm run typescript:check',
		'*.php': 'npm run lint:php:staged',
	},
};
