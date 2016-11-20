var _ = require('lodash');
var Ride = require('../models/ride.model.server.js');
var User = require('../models/user.model.server.js');

exports.post = function(req, res) {
	var newRide = new Ride(req.body);
    newRide.rider = req.user;

    newRide.save(function(err) {
    	if (err){
    		console.log(err);
    	}
    	else {
    		res.jsonp(newRide);
    	}
	});
};

exports.read = function(req,res) {
    res.json(req.article);
}

exports.update = function(req,res) {
    var ride = req.ride;
    ride.save(function(err){
        if (err){
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(ride);
        }
    })
};

exports.list = function(req, res) {
    Ride.find().sort('-postDate').populate('rider', 'displayName')(function(err, rides) {
        if (err){
            return res.status(400).send({
                message:err
            });
        }
        else{
            res.json(rides);
        }
    });
};

exports.rideByID = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send({
            message: 'article is invalid'
        })
    }

    Ride.findById(id).populate('rider', displayName).exec(function(err, ride){
        if (err){
            return next(err);
        }
        else if (!ride){
            return res.status(404).send({
                message: 'No ride has been found'
            });
        }
        req.ride = ride;
        next()
    });
};

exports.delete = function(req, res){
    var ride = req.ride;
    ride.remove(function(err) {
        if (err){
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(ride);
        }
    });
};
