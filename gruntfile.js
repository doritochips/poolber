'use strict';

var fs = require('fs');
var path = require('path');
var assets = require('./grunt-config/asset.js');
var _ = require('lodash');

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		env: {
			test: {
				NODE_ENV: 'test'
			},
			dev: {
				NODE_ENV: 'development'
			},
			prod: {
				NODE_ENV: 'production'
			}
		},
		watch: {
			serverJS: {
				files: _.union(assets.server.gruntConfig, assets.server.allJS),
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientViews: {
				files: assets.client.views,
				options: {
					livereload: true
				}
			},
			clientJS: {
				files: assets.client.js,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: assets.client.css,
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: _.union(assets.server.gruntConfig, assets.server.views, assets.server.allJS, assets.server.config)
				}
			}
		},
		concurrent: {
			default: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		},
		jshint: {
			all: {
				src: _.union(assets.server.gruntConfig, assets.server.allJS, assets.client.js),
				options: {
					jshintrc: true,
					node: true
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			all: {
				src: assets.client.css
			}
		},
		ngAnnotate: {
			production: {
				files: {
					'public/dist/application.js': assets.client.js
				}
			}
		},
		uglify: {
			production: {
				options: {
					mangle: false
				},
				files: {
					'public/dist/application.min.js': 'public/dist/application.js'
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'public/dist/application.min.css': assets.client.css
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	// Lint CSS and JavaScript files.
	grunt.registerTask('lint', ['jshint', 'csslint']);
	
	// Lint project files and minify them into two production files.
	grunt.registerTask('build', ['lint', 'ngAnnotate','uglify', 'cssmin']);

	grunt.registerTask('default', ['lint','concurrent']);

};