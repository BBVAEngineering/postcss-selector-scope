const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const plugin = require('../lib');

const fixturePath = path.join(process.cwd(), 'tests', 'fixtures');
const read = (file) => fs.readFileSync(path.join(fixturePath, file), 'utf-8');
const input = read('develop.css');

postcss()
	.use(plugin)
	.process(input, { from: undefined, to: undefined })
	.then((result) => {
		console.log(result.css);
	})
	.catch(console.error);
