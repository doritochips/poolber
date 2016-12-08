var _ = require('lodash');
var Request = require('../models/request.model.server.js');
var Ride = require('../models/ride.model.server.js');
var User = require('../models/user.model.server.js');
var mongoose = require("mongoose");

exports.list = function(req, res) {
    var user_id = req.params.id;
    //check valid user id
    if (!mongoose.Types.ObjectId.isValid(user_id)){
        return res.status(400).send({
            message: 'request id is invalid'
        })
    }
    var ret = {
        listAsDriver: [],
        listAsPassenger: [],
    };          //return data

    //find all rides posted by this user
    //writen in horrible way, improve with indexed later

    var findRequests = function (next, callback)  {
        //find all posted requests
        Request.find({user: user_id}).exec(function(err, requests){
            if (err){
                return res.status(400).send(err);
            }
            else if (!requests){
                return res.status(404).send({
                    message: 'No requests has been found'
                });
            }else{
                //_.assign(ret.listAsPassenger, requests);  //extend listAsPassenger with rides
                //check if there's next, then continue executing next, or execute callback
                if (next.length) {
                    next[0](next.slice(1, next.length), callback);
                } else {
                    callback();
                }
            }
        });     
    };

    var findRequestedRides = function (next, callback) {
        //find all requested rides
        Ride.find({'passengerList': {'$elemMatch': {'userid': user_id}}}).exec(function(err, rides){
            if (err){
                console.log(err);
                return res.status(400).send(err);
            }
            else if (!rides){
                return res.status(404).send({
                    message: 'No rides has been found'
                });
            }else{
                //console.log("find requested rides");
                //console.log(rides);
                _.assign(ret.listAsPassenger, rides);  //extend listAsPassenger with ride
                if (next.length) {
                    next[0](next.slice(1, next.length), callback);
                } else {
                    callback();
                }
            }
        });   
    };


    var findRides = function (next, callback) {
        //find posted rides
        Ride.find({user: user_id}).exec(function(err, rides){
            if (err){
                return res.status(400).send(err);
            }
            else if (!rides){
                return res.status(404).send({
                    message: 'No rides has been found'
                });
            }else{
                //_.assign(ret.listAsDriver, rides);  //extend listAsDriver with ride
                if (next.length) {
                    next[0](next.slice(1, next.length), callback);
                } else {
                    callback();
                }
            }
        });   
    };

    var findAnsweredRequests = function (next, callback) {
        //find all answered requests
        Ride.find({'driverList': {'$elemMatch': {'userid': user_id}}}).exec(function(err, requests){
            if (err){
                return res.status(400).send(err);
            }
            else if (!requests){
                return res.status(404).send({
                    message: 'No requests has been found'
                });
            }else{
                //console.log("find rided requests");
                //console.log(requests);
                _.assign(ret.listAsDriver, requests);  //extend listAsDriver with ride
                if (next.length) {
                    next[0](next.slice(1, next.length), callback);
                } else {
                    callback();
                }
            }
        });   
    };

    var finalCallback = function() {
        res.json(ret);
    };

    //call each function
    findRequests([findRides, findRequestedRides, findAnsweredRequests], finalCallback);

}
