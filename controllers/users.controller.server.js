'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

/**
 * Signup
 */
exports.signup = function (req, res) {
	
	// Init Variables
    console.log(req.body);
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.name;

	// Then save the user
	user.save(function (err) {
		if (err) {
            console.log(err);
            if (err.code === 11000){
                return res.status(400).send({errorMsg: "Email in use, you sure you don't have an account?"});
            }
			return res.status(400).send({errorMsg: "opps, something went wrong"});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function (err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	});
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
    req.user = req.body;
	passport.authenticate('local', function (err, user, info) {
		if (err || !user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function (err) {
				if (err) {
                    console.log(err);
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	})(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
	req.logout();
	res.redirect('/');
};
