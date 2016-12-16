"use strict";

var msg = require('../controllers/msg.controller.server.js');
var policy = require('../policies/auth.policy.server.js');

module.exports = function(app) {

	app.route('/api/msg/send').all(policy.isLoggedIn)
		.post(msg.send);

};
