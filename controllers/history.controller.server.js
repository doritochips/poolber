var _ = require('lodash');
var Request = require('../models/request.model.server.js');
var Ride = require('../models/ride.model.server.js');
var User = require('../models/user.model.server.js');
var mongoose = require("mongoose");

exports.list = function(req, res) {
    var userid = req.params.id;
    //check valid user id
    if (!mongoose.Types.ObjectId.isValid(userid)){
        return res.status(400).send({
            message: 'request id is invalid'
        })
    }
    var ret = {
        listAsDriver: [],
        listAsPassenger: []
    };          //return data

    //find all rides posted by this user
    //writen in horrible way, improve with indexed later

    var findRequests = function (callback)  {
        //find all posted requests
        Request.find({user: userid}).then(function(err, requests){
            if (err){
                return res.status(400).send(err);
            }
            else if (!requests){
                return res.status(404).send({
                    message: 'No requests has been found'
                });
            }else{
                _.assign(ret.listAsPassenger, requests);  //extend listAsPassenger with rides
                callback && callback();
            }
        });     
    };

    var findRequestedRides = function (callback) {
        //find all requested rides
        Ride.where('passengers').elemMatch({_id: userid}).then(function(err, rides){
            if (err){
                return res.status(400).send(err);
            }
            else if (!rides){
                return res.status(404).send({
                    message: 'No rides has been found'
                });
            }else{
                _.assign(ret.listAsPassenger, rides);  //extend listAsPassenger with ride
                callback && callback();
            }
        });   
    };


    var findRides = function (callback) {
        //find posted rides
        Ride.find({user: userid}).then(function(err, rides){
            if (err){
                return res.status(400).send(err);
            }
            else if (!rides){
                return res.status(404).send({
                    message: 'No rides has been found'
                });
            }else{
                _.assign(ret.listAsDriver, rides);  //extend listAsDriver with ride
                callback && callback();
            }
        });   
    };

    var findAnsweredRequests = function (callback) {
        //find all answered requests
        Ride.where('drivers').elemMatch({_id: userid}).then(function(err, requests){
            if (err){
                return res.status(400).send(err);
            }
            else if (!requests){
                return res.status(404).send({
                    message: 'No requests has been found'
                });
            }else{
                _.assign(ret.listAsDriver, requests);  //extend listAsDriver with ride
                callback && callback();
            }
        });   
    };

    var finalCallback = function() {
        res.json(ret);
    };

    //final version
    //findRequests(findRides(findAnsweredRequests(findRequestedRides(finalCallback()))));

    //version for now
    findRequests(findRides(finalCallback()));

}
