'use strict';

const postcss = require('postcss');
const escapeIdentifiers = require('escape-regex-string');

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
	const defaultExclusions = [/^:root/, /^from/, /^to/, /^(\d{1,3}(?:\.\d*)?)%$/];
	const pseudoElement = /(::\S+|:{1,2}(before|after))/;
	const allExclusions = settings.exclude.concat(defaultExclusions);
	const excludedSelectors = allExclusions.map((value) => {
		if (typeof value === 'string') {
			return new RegExp(`${escapeIdentifiers(value)}$`, 'i');
		}

		if (value instanceof RegExp) {
			return value;
		}

		throw TypeError('options.exlude values must be a string or a regular expression');
	});

	const applyScope = (selector) => {
		const isIncludedInSelector = (value) => value.test(selector);
		const shouldNotBeScoped = excludedSelectors.some(isIncludedInSelector);
		const shouldBePrefixed = pseudoElement.test(selector);

		if (shouldNotBeScoped) {
			return selector;
		}

		if (shouldBePrefixed) {
			return selector.replace(pseudoElement, (value) => {
				return `:not(${settings.not})${value}`;
			});
		}

		return `${selector}:not(${settings.not})`;
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
