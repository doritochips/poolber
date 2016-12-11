'use strict';

module.exports = {
	client: {
		css: [
			'app/styles/*.css'
		],
		js: [
			'app/module/*.js',
			'app/module/**/*.js'
		],
		views: [
			'modules/*/client/views/**/*.html'
		]
	},
	server: {
		gruntConfig: 'gruntfile.js',
		allJS: [
			'server.js', 
			'config/**/*.js', 
			'controllers/*.js'
		],
		models: 'models/*.js',
		routes: 'routes/*.js',
		config: 'config/*.js'
	}
};
