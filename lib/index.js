'use strict';

const postcss = require('postcss');

module.exports = postcss.plugin('postcss-selector-scope', (options = {}) => {
	const settings = Object.assign(
		{
			not: '.style-scope',
			exclude: []
		},
		options
	);

	if (!Array.isArray(settings.exclude)) {
		throw TypeError('options.exclude must be an array');
	}

	/**
	 * Selectors that should not be scoped with :not()
	 * :root
	 * from, to and percentages used in keyframes
	 */
	const defaultExclusions = [':root', 'from', 'to', /[0-9]/];
	const allExclusions = settings.exclude.concat(defaultExclusions);
	const excludedSelectors = allExclusions.map((value) => {
		if (typeof value === 'string') {
			return new RegExp(`${value}`, 'i');
		}

		if (value instanceof RegExp) {
			return value;
		}

		throw TypeError('options.exlude values must be a string or a regular expression');
	});

	const applyScope = (selector) => {
		let shouldBeScoped = true;

		for (const value of excludedSelectors) {
			if (value.test(selector)) {
				shouldBeScoped = false;
				break;
			}
		}

		return shouldBeScoped ? `${selector}:not(${settings.not})` : selector;
	};

	const transform = (selector) =>
		selector
			.split(',')
			.map(applyScope)
			.join(',');

	return (root) => {
		root.walkRules((rule) => {
			rule.selectors = rule.selectors.map(transform);
		});
	};
});
