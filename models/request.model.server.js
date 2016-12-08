var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var requestSchema = new Schema({
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
	user: {
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
	},
	created: {
    type: Date,
    default: Date.now
  	}
});

module.exports = mongoose.model('Request', requestSchema);