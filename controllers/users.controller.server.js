'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var crypto = require('crypto');

// sha1 encryption
var shasum = crypto.createHash('sha1');
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

			// var current_date = (new Date()).valueOf().toString();
			// var random = Math.random().toString();
			// var new_session = shasum.digest('hex');
			req.login(user, function (err) {
				if (err) {
                    console.log(err);
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

			// var current_date = (new Date()).valueOf().toString();
			// var random = Math.random().toString();
			// shasum.update(current_date + random);
			// var new_session = shasum.digest('hex').toString();
			// console.log(new_session);
			// User.update({_id: user._id}, {session: new_session}, function(error){
			// 	if(error){
			// 		if(error){
			// 			console.log(error);
			// 			res.status(400).send(error);
			// 		}else{
						req.login(user, function (err) {
							if (err) {
			                    console.log(err);
								res.status(400).send(err);
							} else {
								res.json(user);
							}
						});
					//}
				//}
			//});
			
		}
	})(req, res, next);
};

// get user information called by 'userService' factory
exports.userinfo = function(req, res) {
	
	User.find({_id:req.body.u_id}, function(error, user){
		if(error){
			console.log(error);
			res.status(400).send(error);
		}else{
			res.json(user);
		}
		
	})
};

/**
 * Signout
 */
exports.signout = function (req, res) {
	req.logout();
	res.redirect('/');
};
