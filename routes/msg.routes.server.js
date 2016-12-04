"use strict";
var msg = require('../controllers/msg.controller.server.js');

module.exports = function(app) {
	app.get('/api/msg/send', msg.send);
};
