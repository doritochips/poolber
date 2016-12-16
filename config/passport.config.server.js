"use strict";

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	User = require('mongoose').model('User');
var WechatStrategy = require('passport-wechat').Strategy;
var users = require('../controllers/users.controller.server.js');

module.exports = function (app, db) {
	// Serialize sessions
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function (id, done) {
		User.findOne({
			_id: id
		}, '-salt -password', function (err, user) {
			done(err, user);
		});
	});

	// Define local strategy
	var Local = new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function (email, password, done) {
		User.findOne({
			email: email
		}, function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user || !user.authenticate(password)) {
				return done(null, false, {
					message: 'Invalid email or password'
				});
			}
			return done(null, user);
		});
	});


	//define facebook strategy
	var Facebook = new FacebookStrategy({
		clientID: '215191925596240',
		clientSecret: '32bd522b06ba5c9b9236cf9efa5bc522',
		callbackURL: '/api/auth/facebook/callback',
		profileFields: ['id', 'name', 'displayName', 'emails', 'photos'],
		passReqToCallback: true
	},
	function (req, accessToken, refreshToken, profile, done) {
		// Set the provider data and include tokens
		var providerData = profile._json;
		providerData.accessToken = accessToken;
		providerData.refreshToken = refreshToken;

		// Create the user OAuth profile
		var providerUserProfile = {
			firstName: profile.name.givenName,
			lastName: profile.name.familyName,
			displayName: profile.displayName,
			email: profile.emails ? profile.emails[0].value : undefined,
			profileImageURL: (profile.id) ? '//graph.facebook.com/' + profile.id + '/picture?type=large' : undefined,
			provider: 'facebook',
			providerIdentifierField: 'id',
			providerData: providerData
		};
		// Save the user OAuth profile
		users.saveOAuthUserProfile(req, providerUserProfile, done);
	});

	//define wechat strategy
	var Wechat = new WechatStrategy({
		appID: 'wxfe8d08cc30586362',						//'wx02d33dd17d1d0461',
		appSecret: '3b9b6424f581913f22417f305abf6960',			//'d3361be9785345690c17213176415cf2',
		callbackURL: '/api/auth/wechat/callback',
		scope: 'snsapi_base',
		state: '123'
	},
	function (req, accessToken, refreshToken, profile, expires_in, done) {
		// Set the provider data and include tokens
		console.log(profile);
		var providerData = profile._json;
		providerData.accessToken = accessToken;
		providerData.refreshToken = refreshToken;

		// Create the user OAuth profile
		var providerUserProfile = {
			firstName: profile.name.givenName,
			lastName: profile.name.familyName,
			displayName: profile.displayName,
			email: profile.emails ? profile.emails[0].value : undefined,
			profileImageURL: (profile.id) ? '//graph.facebook.com/' + profile.id + '/picture?type=large' : undefined,
			provider: 'wechat',
			providerIdentifierField: 'id',
			providerData: providerData
		};
		// Save the user OAuth profile
		users.saveOAuthUserProfile(req, providerUserProfile, done);
	});


	passport.use(Local);
	passport.use(Facebook);
	passport.use(Wechat);


	// Add passport's middleware
	app.use(passport.initialize());
	app.use(passport.session());
};