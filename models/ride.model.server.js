var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var rideSchema = new Schema({
    title:  String,
    date: {
    	type: Date, 
    	default: Date.now
    }
});

module.exports = mongoose.model('Ride', rideSchema);