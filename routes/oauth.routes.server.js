'use strict';

var passport = require('passport');

var users = require('../controllers/users.controller.server.js');
var oauth = require('../controllers/oauth.controller.server.js');



module.exports = function (app) {

	// Setting the facebook oauth routes
	app.route('/api/auth/facebook').get(oauth.oauthCall('facebook', {
		scope: ['email']
	}));
	app.route('/api/auth/facebook/callback').get(oauth.oauthCallback('facebook'));
};
