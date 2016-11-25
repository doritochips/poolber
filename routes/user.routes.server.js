"use strict";

var passport = require('passport');
var users = require('../controllers/users.controller.server.js')

module.exports = function(app) {
	// Setting up the users authentication api
	app.route('/api/auth/signup').post(users.signup);
	app.route('/api/auth/signin').post(users.signin);
	app.route('/api/auth/signout').post(users.signout);
	app.route('/api/data/userinfo').post(users.userinfo);
	app.route('/api/auth/forgot').post(users.forgot);
	app.route('/api/auth/reset/:token').get(users.validateResetToken);
	app.route('/api/auth/reset/:token').post(users.reset);
};