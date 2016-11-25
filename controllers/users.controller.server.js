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

			var current_date = (new Date()).valueOf().toString();
			var random = Math.random().toString();
			shasum.update(current_date + random);
			var new_session = shasum.digest('hex').toString();			
			User.update({_id: user._id}, {$set:{session: new_session}}, function(error){
				if(error){
					console.log(error);
					res.status(400).send(error);
				}else{
					req.login(user, function (err) {
						if (err) {
		                    console.log(err);
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
					console.log(error);
					res.status(400).send(error);
				}else{
					req.login(user, function (err) {
						if (err) {
		                    console.log(err);
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
	
	User.find({session:req.body.session}, function(error, user){
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
	User.update({session: req.body.session}, {$set:{session: -1}}, function(error){
		if(error){
			console.log(error);
			res.status(500).send(error);
		}else{
			res.send("logout success");
		}
	})	
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
						})
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
				name: user.displayName,
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
					console.log(err);
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
}

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
	console.log(req.body);
	console.log(req.params.token);
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
						console.log(user);
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
