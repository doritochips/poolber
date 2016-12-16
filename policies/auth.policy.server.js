'use strict';

var User = require('../models/user.model.server.js');


exports.isLoggedIn = function (req, res, next) {
	var session = req.headers.session;

	if (!session) {
		return res.status(400).send('unexpected authorization error');
	}
	else {
		User.find({session: session}).exec(function(err, user){
			if (err){
				res.status(400).send('unexpected authorization error');
			}
			else {
				return next();
			}
		});
	}
};

exports.everyone = function (req,res,next){
	return next();
};
