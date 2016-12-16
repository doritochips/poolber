"use strict";

var rides = require('../controllers/ride.controller.server.js');
var policy = require('../policies/auth.policy.server.js');

module.exports = function(app) {

	app.route('/api/ride').all(policy.isLoggedIn)
		.post(rides.post);

	app.route('/api/requestRide').all(policy.isLoggedIn)
		.post(rides.requestRide);

	app.route('/api/rides').all(policy.everyone)
		.get(rides.list);

	app.route('/api/ride/:id').all(policy.everyone)
		.get(rides.read);		
};
