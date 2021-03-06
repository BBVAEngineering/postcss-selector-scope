'use strict';

module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: 2017,
		sourceType: 'module'
	},
	extends: [
		'plugin:node/recommended',
		'eslint-config-bbva',
		'plugin:prettier/recommended'
	],
	env: {
		node: true
	},
	rules: {
		'no-sync': 0
	},
	overrides: [
		{
			files: ['tests/**/*.js'],
			env: {
				jest: true
			},
			plugins: ['jest'],
			rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
				'no-process-env': 0,
				'no-sync': 0,
				'max-nested-callbacks': 0
			})
		}
	]
};
