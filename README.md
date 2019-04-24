# postcss-selector-scope

[![Build Status](https://travis-ci.org/BBVAEngineering/postcss-selector-scope.svg?branch=master)](https://travis-ci.com/BBVAEngineering/postcss-selector-scope)
[![GitHub version](https://badge.fury.io/gh/BBVAEngineering%2Fpostcss-selector-scope.svg)](https://badge.fury.io/gh/BBVAEngineering%2Fpostcss-selector-scope)
[![NPM version](https://badge.fury.io/js/postcss-selector-scope.svg)](https://badge.fury.io/js/postcss-selector-scope)
[![Dependency Status](https://david-dm.org/BBVAEngineering/postcss-selector-scope.svg)](https://david-dm.org/BBVAEngineering/postcss-selector-scope)
[![codecov](https://codecov.io/gh/BBVAEngineering/postcss-selector-scope/branch/master/graph/badge.svg)](https://codecov.io/gh/BBVAEngineering/postcss-selector-scope)
[![Greenkeeper badge](https://badges.greenkeeper.io/BBVAEngineering/postcss-selector-scope.svg)](https://greenkeeper.io/)

[![NPM](https://nodei.co/npm/postcss-selector-scope.png?downloads=true&downloadRank=true)](https://nodei.co/npm/postcss-selector-scope/)

> PostCSS plugin to scope styles using :not() pseudo-class

Adds the `:not([your-selector])` pseudo-class to the allowed selectors of the processed CSS to prevent undesired styles having effect over certain elements. 

A typical use case is to protect Web Components from styles inherited from the main document in browsers without Shadow DOM support.

## Input 

```css
:root {
  --some-var: red;
}

html, 
body {
  margin: 0;
}

.some-class {
  color: red;
}

.parent .child {
  color: red;
}
```

## Default output

```css
:root {
  --some-var: red;
}

html:not(.style-scope),
body:not(.style-scope) {
  margin: 0;
}

.some-class:not(.style-scope) {
  color: red;
}

.parent .child:not(.style-scope) {
  color: red;
}
```

## Installation

```
npm i -S postcss-selector-scope
```

## Usage

```js
const postcss = require('postcss');
const selectorScope = require('postcss-selector-scope');

const options = {
  not: '.custom-selector',
  exclude: ['.some-class']
};

postcss()
  .use(selectorScope(options))
  .process(cssFileContent)
  .then((result) => console.log(result.css));
```

## Options

### `not`

type: `String`   
default: `.style-scope`

Selector used inside `:not()` selector.  
The default value is the one used by [ShadyCSS library](https://github.com/webcomponents/shadycss).

### `exclude`

type: `Array`   
default: `[]`

List of selectors to exclude.   
Each value can be a string or a regular expression.   
`:root` selector is excluded by default.

# Contribute

If you want to contribute, please read the [CONTRIBUTING.md](CONTRIBUTING.md).


# Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/BBVAEngineering/postcss-selector-scope/tags).


# Authors

See the list of [contributors](https://github.com/BBVAEngineering/postcss-selector-scope/graphs/contributors) who participated in this project.


# License

This project is licensed under the [MIT License](LICENSE.md).
