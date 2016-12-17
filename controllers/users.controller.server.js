'use strict';

/**
 * Module dependencies.
 */
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var crypto = require('crypto');
var async = require('async');
var nodemailer = require('nodemailer');



var smtpTransport = nodemailer.createTransport('smtps://poolbercanada%40gmail.com:devpassword@smtp.gmail.com');

// sha1 encryption
var shasum = crypto.createHash('sha1');
/**
 * Signup
 */
exports.signup = function (req, res) {
	
	// Init Variables
    //console.log(req.body);
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.email.substring(0, user.email.indexOf("@"));

	// Then save the user
	user.save(function (err) {
		if (err) {
            //console.log(err);
            if (err.code === 11000){
                return res.status(400).send({errorMsg: "Email in use, you sure you don't have an account?"});
            }
			return res.status(400).send({errorMsg: "opps, something went wrong"});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			var current_date = (new Date()).valueOf().toString();
			var random = Math.random().toString();
			shasum.update(current_date + random);
			var new_session = shasum.digest('hex').toString();			
			User.update({_id: user._id}, {$set:{session: new_session}}, function(error){
				if(error){
					//console.log(error);
					res.status(400).send(error);
				}else{
					req.login(user, function (err) {
						if (err) {
		                    //console.log(err);
							res.status(400).send(err);
						} else {
							res.send(new_session);
						}
					});
				}
			});
			//reset shasum
			shasum = crypto.createHash('sha1');
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

			var current_date = (new Date()).valueOf().toString();
			var random = Math.random().toString();
			shasum.update(current_date + random);
			var new_session = shasum.digest('hex').toString();			
			User.update({_id: user._id}, {$set:{session: new_session}}, function(error){
				if(error){
					//console.log(error);
					res.status(400).send(error);
				}else{
					req.login(user, function (err) {
						if (err) {
		                    //console.log(err);
							res.status(400).send(err);
						} else {
							res.send(new_session);
						}
					});
				}
			});
			// reset shsum
			shasum = crypto.createHash('sha1');
			
		}
	})(req, res, next);
};

// get user information called by 'userService' factory
exports.userinfo = function(req, res) {
	
	User.find({session:req.body.session}).exec(function(error, user){
		if(error){
			//console.log(error);
			res.status(400).send(error);
		}else{
			if(user.length === 0){
				res.send("failure");
				return;
			}
			user[0].password = undefined;
			user[0].salt = undefined;
			res.json(user);
		}
	});
};

/**
 * Signout
 */
exports.signout = function (req, res) {
	User.update({session: req.body.session}, {$set:{session: -1}}, function(error){
		if(error){
			//console.log(error);
			res.status(500).send(error);
		}else{
			res.send("logout success");
		}
	});	
};


exports.forgot = function(req,res,next) {
	async.waterfall([
		function(done) {
			crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function(token, done) {
			User.findOne({ 
				email: req.body.email 
			}, function(err, user) {
				if (!user) {
		            return res.status(400).send({
		              message: 'No account with that username has been found'
		            });
				}
				else{
					if(user.resetPasswordExpires - Date.now() > (3600000 - 1*60*1000)){	//wait 1 minute
						return res.status(400).send({
							message: 'An email has been sent, please check your inbox and spam'
						});
					}
					user.resetPasswordToken = token;
					user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
					user.save(function(err) {
						done(err, token, user);
					});		
					//console.log("token set");	
				}
			});
		},
		function (token, user, done) {
			var httpTransport = 'http://';
			res.render(path.resolve('templates/reset-password-email'), {
				name: user.firstName,
				url: httpTransport + req.headers.host + '/api/auth/reset/' + token
			}, function (err, emailHTML) {
				done(err, emailHTML, user);
			});
		},
		// If valid email, send reset email using service
		function (emailHTML, user, done) {
			var mailOptions = {
				to: user.email,
				from: ' "Poolber Support" <support@poolber.ca>',
				subject: 'Password Reset',
				html: emailHTML
			};
			//console.log(mailOptions);
			smtpTransport.sendMail(mailOptions, function (err) {
				if (!err) {
					res.send({
						message: 'An email has been sent to the provided email with further instructions.'
					});
				} else {
					//console.log(err);
					return res.status(400).send({
						message: 'Failure sending email'
					});
				}
				done(err);
			});
		}
	], function(err) {
		if (err) return next(err);
	});
};

exports.validateResetToken = function (req, res) {
	User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	}, function (err, user) {
		if (!user) {
			return res.redirect('/#/password/resetinvalid');
		}
		return res.redirect('/#/password/reset/' + req.params.token);
	});
};

exports.reset = function (req, res, next) {
	// Init Variables
	// console.log(req.body);
	// console.log(req.params.token);
	var passwordDetails = req.body;
	var message = null;

	async.waterfall([

		function (done) {
			User.findOne({
				resetPasswordToken: req.params.token,
				resetPasswordExpires: {
					$gt: Date.now()
				}
			}, function (err, user) {
				if (!err && user) {
					if (passwordDetails.newPassword === passwordDetails.verifyPassword) {

						user.password = passwordDetails.newPassword;
						//console.log(user);
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;

						user.save(function (err) {
							if (err) {
								return res.status(400).send(err);
							} else {
								req.login(user, function (err) {
									if (err) {
										res.status(400).send(err);
									} else {
										// Remove sensitive data before return authenticated user
										user.password = undefined;
										user.salt = undefined;

										res.json(user);

										done(err, user);
									}
								});
							}
						});
					} else {
						return res.status(400).send({
							message: 'Passwords do not match'
						});
					}
				} else {
					return res.status(400).send({
						message: 'This link is invalid or has expired.'
					});
				}
			});
		}], function (err) {
		if (err) {
			return next(err);
		}
	});
};

exports.saveProfile = function(req, res){
	var user = req.body;
	console.log(user);
	User.update({_id: user.id}, 
		{$set:{displayName: user.displayName, email: user.email, phone:user.phone, wechat: user.wechat}},
		function(error){
		if(error){
			//console.log(error);
			res.status(500).send(error);
		}else{
			res.send("success");
		}
	});
};





// OAUTH

// URLs for which user can't be redirected on signin
var noReturnUrls = [
	'/signin',
	'/signup'
];


/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {

	return function (req, res, next) {
		// Authenticate
		passport.authenticate(strategy, scope)(req, res, next);
	};
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
	
	return function (req, res, next) {
		passport.authenticate(strategy, function (err, user, redirectURL) {
			if (err) {
				return res.redirect('/#/login?err=' + encodeURIComponent(err));
			}
			if (!user) {
				return res.redirect('/#/login');
			}
			req.login(user, function (err) {
				if (err) {
					return res.redirect('/#/login');
				}
				var sessionRedirectURL = user.session;
				return res.redirect('/dash.html?' + sessionRedirectURL + '#/history');
			});
		})(req, res, next);
	};
};


/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
	if (!req.user) {
		User.findOne({email:providerUserProfile.email}, function (err, user) {
			if (err) {
				//console.log(err);
				return done(err);
			} else {
				var current_date = (new Date()).valueOf().toString();
				var random = Math.random().toString();
				shasum.update(current_date + random);
				var new_session = shasum.digest('hex').toString();
				if (!user) {
					user = new User({
						firstName: providerUserProfile.firstName,
						lastName: providerUserProfile.lastName,
						displayName: providerUserProfile.displayName,
						email: providerUserProfile.email,
						profileImageURL: providerUserProfile.profileImageURL,
						provider: providerUserProfile.provider,
						providerData: providerUserProfile.providerData,
						session: new_session
					});
					// And save the user
					user.save(function (err) {
						return done(err, user);
					});
				} else {
					user.session = new_session;
					user.save(function(err){
						return done(err, user);
					});
				}
				// reset shsum
				shasum = crypto.createHash('sha1');
			}
		});
	} else {
		// NOT IMPLEMENTED YET
		// User is already logged in, join the provider data to the existing user
		var user = req.user;
		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!user.additionalProvidersData) {
				user.additionalProvidersData = {};
			}
			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;
			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');
			// And save the user
			user.save(function (err) {
				return done(err, user, '/settings/accounts');
			});
		} else {
			return done(new Error('User is already connected using this provider'), user);
		}
	}
};
/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
	var user = req.user;
	var provider = req.query.provider;

	if (!user) {
		return res.status(401).json({
			message: 'User is not authenticated'
		});
	} else if (!provider) {
		return res.status(400).send();
	}

	// Delete the additional provider
	if (user.additionalProvidersData[provider]) {
		delete user.additionalProvidersData[provider];

		// Then tell mongoose that we've updated the additionalProvidersData field
		user.markModified('additionalProvidersData');
	}

	user.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			req.login(user, function (err) {
				if (err) {
					return res.status(400).send(err);
				} else {
					return res.json(user);
				}
			});
		}
	});
};
