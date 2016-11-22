var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var rideSchema = new Schema({
	departure: { 
		type: String, 
		lowercase: true, 
		trim: true 
	},
	destination:  { 
		type: String, 
		lowercase: true, 
		trim: true 
	},	
	userID: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	startTime:{
		type: Date
	},
	endTime:{
		type: Date
	},
	passenger: {
		type: Number		
	},
	note:{
		type: String
	}
});

module.exports = mongoose.model('Ride', rideSchema);