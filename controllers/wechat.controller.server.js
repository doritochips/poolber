var OAuth = require('wechat-oauth');
var client = new OAuth('your appid', 'your secret');

var User = require('../models/user.model.server.js');
var Token = require('../models/token.model.server.js');

var appid = 'wxfe8d08cc30586362';
var secret = '3b9b6424f581913f22417f305abf6960';
var callbackURL = 'http://127.0.0.1:3000/api/auth/wechat/callback';
var scope = 'snsapi_base';
var state = '123';



/**
 * OAuth provider call
 */
exports.oauthCall = function (req, res) {
	var client = new OAuth(appid, secret, function (openid, callback) {
		Token.getToken(openid, callback);
	}, function (openid, token, callback) {
		Token.setToken(openid, token, callback);
	});
	res.redirect(client.getAuthorizeURL(callbackURL, state, scope));
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (req, res) {
	return res.send({"message": "wtf"});
};