module.exports = {
	mode: 'modules',
	out: 'doc',
	exclude: [
		'**/node_modules/**',
		'**/test/**',
		'**/dist/**',
		'**/demo/**',
		'**/polymer.ts',
		'**/ozone-login/**'
	],
	lernaExclude: [
		'packages/demo/ozone-components-demo',
		'ozone-components-demo',
		'ozone-login'
	],
	name: 'ozone-components',
	excludePrivate: true,
	readme: 'README.md'
};
