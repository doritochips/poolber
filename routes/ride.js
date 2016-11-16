"use strict";

var rides = require('../controllers/ride.controller.server.js');

module.exports = function(app) {
	app.post('/ride', rides.post);
	app.get('/ride', rides.list);
};
