"use strict";

var history = require('../controllers/history.controller.server.js')

module.exports = function(app) {
	// Setting up the users authentication api
	app.route('/api/history/:id').get(history.list);
	app.route('/api/delete_ride_post/:id').post(history.deleteRidePost);
	app.route('/api/delete_request_post/:id').post(history.deleteRequestPost);
	//app.route('/api/remove_from_passenger_list/:id').post(history.removeFromPassengerList);
	//app.route('/api/remove_from_driver_list/:id').post(history.removeFromDriverList);
};
