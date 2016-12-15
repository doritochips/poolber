"use strict";

var requests = require('../controllers/request.controller.server.js');

module.exports = function(app) {
	app.post('/api/request', requests.post);
	app.post('/api/request/offer_ride', requests.offerRide);
	app.get('/api/requests', requests.list);
	app.get('/api/request/:id', requests.read);

};
