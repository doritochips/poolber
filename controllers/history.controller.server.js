"use strict";

var _ = require('lodash');
var Request = require('../models/request.model.server.js');
var Ride = require('../models/ride.model.server.js');
var User = require('../models/user.model.server.js');
var mongoose = require("mongoose");
var ObjectId = require('mongoose').Types.ObjectId;


var notSensitiveData = '-password -salt -resetPasswordToken -resetPasswordExpires -session';
var driverList = ['postedRides', 'appliedRequest'];
var postedList = ['postedRides', 'postedRequest'];

var removeUnprovidedFields = function(listOfPeople) {
    for (var p of listOfPeople){
        if(!p.wechatProvided){
            p.userid.wechat = undefined;
        }
        if(!p.phoneProvided){
            p.userid.phone = undefined;
        }
        if(!p.emailProvided){
            p.userid.email = undefined;
        }  
    }
    return listOfPeople;
};

exports.deleteRidePost = function(req, res){
    var postID = req.params.id;
    var sessionKey = req.body.session;
    User.findOne({session:sessionKey}).exec(function(err, user){
        if (err){
            return res.status(400).send(err);
        }
        else if (!user){
            return res.status(400).send({
                message: 'You do not have the right to delete'
            });
        }
        else {
            Ride.find({_id: postID}).remove().exec(function(err, result){
                if (err){
                    return res.status(400).send(err);
                }
                else{
                    return res.jsonp(result);
                }
            });
        }
    });
};


exports.deleteRequestPost = function(req, res){
    var postID = req.params.id;
    var sessionKey = req.body.session;
    User.findOne({session:sessionKey}).exec(function(err, user){
        if (err){
            return res.status(400).send(err);
        }
        else if (!user){
            return res.status(400).send({
                message: 'You do not have the right to delete'
            });
        }
        else {
            Request.find({_id: postID}).remove().exec(function(err, result){
                if (err){
                    return res.status(400).send(err);
                }
                else{
                    return res.jsonp(result);
                }
            });
        }
    });
};

// exports.removeFromDriverList = function(req, res){
//     var postID = req.params.id;
//     var sessionKey = req.body.session;
//     User.findOne({session:sessionKey}).exec(function(err, user){
//         if (err){
//             return res.status(400).send(err);
//         }
//         else if (!user){
//             return res.status(400).send({
//                 message: 'Action unauthorized'
//             });
//         }
//         else {
//             Request.update({_id: postID},{'$pull': {'driverList': {'userid': user._id}}}).exec(function(err, result){
//                 if (err){
//                     return res.status(400).send(err);
//                 }
//                 else{
//                     return res.jsonp(result);
//                 }
//             });
//         }
//     });
// };

// exports.removeFromPassengerList = function(req, res){
//     var postID = req.params.id;
//     var sessionKey = req.body.session;
//     User.findOne({session:sessionKey}).exec(function(err, user){
//         if (err){
//             return res.status(400).send(err);
//         }
//         else if (!user){
//             return res.status(400).send({
//                 message: 'Action unauthorized'
//             });
//         }
//         else {
//             Ride.update({_id: postID},{'$pull': {'passengerList': {'userid': user._id}}}).exec(function(err, result){
//                 if (err){
//                     return res.status(400).send(err);
//                 }
//                 else{
//                     return res.jsonp(result);
//                 }
//             });
//         }
//     });
// };


exports.list = function(req, res) {
    var user_id = req.params.id;
    //check valid user id
    if (!mongoose.Types.ObjectId.isValid(user_id)){
        return res.status(400).send({
            message: 'request id is invalid'
        });
    }
    var ret = {
        postedRequest: [],
        appliedRequest: [],
        postedRides: [],
        appliedRides: []
    };          //return data

    //find all rides posted by this user
    //writen in horrible way, improve with indexed later

    var findRequests = function (next, callback)  {
        //find all posted requests
        Request.find({user: user_id}).populate('driverList.userid', notSensitiveData).exec(function(err, requests){
            if (err){
                return res.status(400).send(err);
            }
            else if (!requests){
                return res.status(404).send({
                    message: 'No requests has been found'
                });
            }else{
                for (var request of requests){
                    request.driverList = removeUnprovidedFields(request.driverList);
                    //console.log(request.driverList);
                }
                _.assign(ret.postedRequest, requests);  //extend listAsPassenger with rides
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
        Ride.find({'passengerList.userid': ObjectId(user_id)}).populate('user', 'displayName').exec(function(err, rides){
            if (err){
                //console.log(err);
                return res.status(400).send(err);
            }
            else if (!rides){
                return res.status(404).send({
                    message: 'No rides has been found'
                });
            }else{
                //console.log("find requested rides");
                //console.log(rides);
                _.assign(ret.appliedRides, rides);  //extend listAsPassenger with ride
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
        Ride.find({user: user_id}).populate('passengerList.userid', notSensitiveData).exec(function(err, rides){
            if (err){
                return res.status(400).send(err);
            }
            else if (!rides){
                return res.status(404).send({
                    message: 'No rides has been found'
                });
            }else{
                for (var ride of rides){
                    ride.passengerList = removeUnprovidedFields(ride.passengerList);
                    //console.log(ride.passengerList);
                }
                _.assign(ret.postedRides, rides);  //extend listAsDriver with ride
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
        Request.find({'driverList.userid': ObjectId(user_id)}).populate('user','displayName').exec(function(err, requests){
            if (err){
                return res.status(400).send(err);
            }
            else if (!requests){
                return res.status(404).send({
                    message: 'No requests has been found'
                });
            }else{
                // console.log("find rided requests");
                // console.log(requests);
                _.assign(ret.appliedRequest, requests);  //extend listAsDriver with ride
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

};
