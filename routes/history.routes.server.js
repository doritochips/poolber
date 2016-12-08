"use strict";

var history = require('../controllers/history.controller.server.js')

module.exports = function(app) {
	// Setting up the users authentication api
	app.route('/api/history/:id').get(history.list);
};