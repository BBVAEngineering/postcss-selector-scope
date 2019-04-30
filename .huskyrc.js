'use strict';

module.exports = {
	hooks: {
		'pre-commit': 'lint-staged',
		'commit-msg': 'commitlint -e $HUSKY_GIT_PARAMS',
		'pre-push': 'npm run lint:js && npm test'
	}
};
