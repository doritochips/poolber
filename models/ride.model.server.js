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
	scheduleDate: {
		type: Date
	},
	rider: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	postDate: {
		type: Date, 
		default: Date.now
	}
});

module.exports = mongoose.model('Ride', rideSchema);