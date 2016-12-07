"use strict";

var rides = require('../controllers/ride.controller.server.js');

module.exports = function(app) {
	app.post('/api/ride', rides.post);
	app.post('/api/requestRide', rides.requestRide);
	app.get('/api/rides', rides.list);	
	app.get('/api/ride/:id', rides.read);
};
