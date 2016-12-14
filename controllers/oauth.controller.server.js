'use strict';

var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

// URLs for which user can't be redirected on signin
var noReturnUrls = [
	'/authentication/signin',
	'/authentication/signup'
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
			//console.log(err);
			//console.log(redirectURL);
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

				return res.redirect(redirectURL || sessionRedirectURL || '/');
			});
		})(req, res, next);
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
	console.log("saving");
	console.log(req.user);
	if (!req.user) {
		console.log("no user");
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerUserProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		User.findOne(searchQuery, function (err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					user = new User({
						firstName: providerUserProfile.firstName,
						lastName: providerUserProfile.lastName,
						username: availableUsername,
						displayName: providerUserProfile.displayName,
						email: providerUserProfile.email,
						profileImageURL: providerUserProfile.profileImageURL,
						provider: providerUserProfile.provider,
						providerData: providerUserProfile.providerData
					});

					// And save the user
					user.save(function (err) {
						return done(err, user);
					});
				} else {
					return done(err, user);
				}
			}
		});
	} else {
		console.log("found user");
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
