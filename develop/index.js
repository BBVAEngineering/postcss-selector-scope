'use strict';

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const plugin = require('../lib');

const fixture = 'develop';
const inputPath = path.join(process.cwd(), 'tests/fixtures/develop');
const outputPath = path.join(process.cwd(), 'tests/fixtures/develop-output');
const input = fs.readFileSync(path.join(inputPath, `${fixture}.css`), 'utf-8');

const write = (result) => {
	console.log(`\n⚡️ ${fixture}-processed.css updated\n`);

	fs.writeFileSync(path.join(outputPath, `${fixture}-processed.css`), result.css);
};

postcss()
	.use(
		plugin({
			exclude: ['.excluded', '[data-icon]', ':not(.something)', '#id', 'strong']
		})
	)
	.process(input, { from: undefined })
	.then(write)
	.catch(console.error);
