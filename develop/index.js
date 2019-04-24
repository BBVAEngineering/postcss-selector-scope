'use strict';

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const plugin = require('../lib');

const fixture = 'develop';
const fixturePath = path.join(process.cwd(), 'tests', 'fixtures');
const input = fs.readFileSync(path.join(fixturePath, `${fixture}.css`), 'utf-8');

const write = (result) => fs.writeFileSync(path.join(fixturePath, `${fixture}-processed.css`), result.css, 'utf-8');

postcss()
	.use(plugin)
	.process(input, { from: undefined })
	.then(write)
	.catch(console.error);
