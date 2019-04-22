'use strict';

const postcss = require('postcss');

module.exports = postcss.plugin('postcss-selector-scope', (options = {}) => {
	const settings = Object.assign({
		not: '.style-scope',
		exclude: [':root']
	}, options);

	const excluded = (settings.exclude || []).join('|');
	const included = new RegExp(`^(?!${excluded})\\S+`);

	const scope = (pattern) => (str) => {
		const result = str.match(pattern) ? `${str}:not(${settings.not})` : str;

		return result;
	};

	const transform = (pattern) => (selector) => selector.split(' ').map(scope(pattern)).join(' ');

	return (root) => {
		root.walkRules((rule) => {
			rule.selectors = rule.selectors.map(transform(included));
		});
	};
});
