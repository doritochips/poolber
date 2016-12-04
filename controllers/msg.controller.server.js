'use strict';

// Twilio Credentials 
var accountSid = 'AC4a54dee6503157c7042671f759e288a4'; 
var authToken = '0b7f390773389bfd3b41dfb1189018e5'; 	//auth token, https://www.twilio.com/console/phone-numbers/PN9961e7e3db2fa4a295d9df38f262b563

//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
 
exports.send = function (req, res) {
	var recipient = req.body.recipient;
	var cusMessage = req.body.message; 
	client.messages.create({ 
	    to: recipient, //"+12267004160" 
	    from: "+12262705666", 
	    body: cusMessage, 
	}, function(err, message) { 
	    if (err){
	    	res.send(err);
	    }
	    else {
	    	res.send(message);
	    }
	});
};



