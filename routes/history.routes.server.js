"use strict";

var history = require('../controllers/history.controller.server.js')
var policy = require('../policies/auth.policy.server.js');

module.exports = function(app) {
	// Setting up the users authentication api
	app.route('/api/history/:id').all(policy.isLoggedIn)
		.post(history.list);

	app.route('/api/delete_ride_post/:id').all(policy.isLoggedIn)
		.post(history.deleteRidePost);

	app.route('/api/delete_request_post/:id').all(policy.isLoggedIn)
		.post(history.deleteRequestPost);

	//app.route('/api/remove_from_passenger_list/:id').post(history.removeFromPassengerList);
	//app.route('/api/remove_from_driver_list/:id').post(history.removeFromDriverList);
};
