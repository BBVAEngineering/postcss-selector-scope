'use strict';

const postcss = require('postcss');
const { stripIndent } = require('common-tags');
const plugin = require('../../lib');

const process = (input, options) =>
	postcss()
		.use(plugin(options))
		.process(input, { from: undefined });

describe('postcss-selector-scope', () => {
	describe('without options', () => {
		it('uses :not(.style-scope) as default scope selector', () => {
			const input = '.class {}';
			const expected = '.class:not(.style-scope) {}';
			const result = process(input);

			expect(result.css).toBe(expected);
		});

		describe('applies default selector exclusions', () => {
			it('does not scope :root selector', () => {
				const input = ':root {}';
				const result = process(input);

				expect(result.css).toBe(input);
			});

			it('does not scope from, to and percentages in keyframes', () => {
				const input = stripIndent`
					@keyframes any {
						from {}
						50% {}
						66.34%,
						75.123%,
						67.2% {}
						to {}
					}
				`;
				const result = process(input);

				expect(result.css).toBe(input);
			});
		});
	});

	describe('with options', () => {
		it('applies the specified selector in options.not', () => {
			const input = '.class {}';
			const expected = '.class:not(.custom) {}';
			const result = process(input, {
				not: '.custom'
			});

			expect(result.css).toBe(expected);
		});

		it('does not scope the specified selectors in options.exclude', () => {
			const input = stripIndent`
				.not-me {}
				.yep {}
				.any .nope {}
			`;
			const expected = stripIndent`
				.not-me {}
				.yep:not(.style-scope) {}
				.any .nope {}
			`;
			const result = process(input, {
				exclude: ['.not-me', '.nope']
			});

			expect(result.css).toBe(expected);
		});

		it('throws an error if options.exclude is not an array', () => {
			const input = '.class {}';

			expect(() =>
				process(input, {
					exclude: 'invalid-option'
				})
			).toThrowError(/must be an array/);
		});

		it('throws an error if any of the options.exclude values is not a string or a regular expression', () => {
			const input = '.class {}';
			const invalidOption = 5;
			const exclude = ['text', /.a/, invalidOption];

			expect(() =>
				process(input, {
					exclude
				})
			).toThrowError(/must be a string or a regular expression/);
		});
	});

	describe('processing', () => {
		it('adds :not() to the last item of a selector with nested items', () => {
			const input = 'div #foo .class {}';
			const expected = 'div #foo .class:not(.style-scope) {}';
			const result = process(input);

			expect(result.css).toBe(expected);
		});

		it('adds :not() to selectors that include default exclusions in their name', () => {
			const input = stripIndent`
				.class-with-numbers-234,
				.class-with-from,
				.class-with-to {}
			`;
			const expected = stripIndent`
				.class-with-numbers-234:not(.style-scope),
				.class-with-from:not(.style-scope),
				.class-with-to:not(.style-scope) {}
			`;
			const result = process(input);

			expect(result.css).toBe(expected);
		});
	});
});
