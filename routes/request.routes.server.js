"use strict";

var requests = require('../controllers/request.controller.server.js');
var policy = require('../policies/auth.policy.server.js');


module.exports = function(app) {

	app.route('/api/request').all(policy.isLoggedIn)
		.post(requests.post);

	app.route('/api/request/offer_ride').all(policy.isLoggedIn)
		.post(requests.offerRide);

	app.route('/api/requests').all(policy.isLoggedIn)
		.get(requests.list);

	app.route('/api/request/:id').all(policy.isLoggedIn)
		.get(requests.read);
};
