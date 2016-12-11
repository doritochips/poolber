"use strict";

var _ = require('lodash');
var path = require('path');
var Ride = require('../models/ride.model.server.js');
var User = require('../models/user.model.server.js');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport('smtps://poolbercanada%40gmail.com:devpassword@smtp.gmail.com');

exports.post = function(req, res) {    
    //console.log(req.body);
	var newRide = new Ride(req.body);          
    newRide.user = {_id: req.body.user_id};
    newRide.save(function(err) {
    	if (err){
            console.log(err);
    		res.status(400).send({
                message: 'Some error occured when saving the post!'
            });
    	}
    	else {
    		res.send("Success");
    	}
	});
};

exports.read = function(req,res) {
    var id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send({
            message: 'ride id is invalid'
        });
    }
    //populate with username
    Ride.findById(id).exec(function(err, ride){
        if (err){
            return res.status(400).send(err);
        }
        else if (!ride){
            return res.status(404).send({
                message: 'No ride has been found'
            });
        }else{
            res.json(ride);
        }
        
    });
};

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
    });
};

exports.list = function(req, res) {
    Ride.find().sort({startTime: -1}).exec(function(err, rides) {
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
        });
    }

    Ride.findById(id).populate('rider', 'displayName').exec(function(err, ride){
        if (err){
            return next(err);
        }
        else if (!ride){
            return res.status(404).send({
                message: 'No ride has been found'
            });
        }
        req.ride = ride;
        next();
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

exports.requestRide = function(req, res){
    //console.log(req.body);
    var requestObject = req.body;
    Ride.findOne({_id: requestObject.ride_id}, function(err, response){
        var exist = false;
        response.passengerList.forEach(function(it){
            if(it.userid === requestObject.passenger_id){
                exist = true;
                return;
            }
        });
        if(!exist){
            callback();
        }else{
            res.send("failure");
        }
    });
    function callback(){
        Ride.update({_id: requestObject.ride_id},
        {$push: {'passengerList':
            {
                userid: requestObject.passenger_id,
                emailProvided: requestObject.selected.email,
                phoneProvided: requestObject.selected.phone,
                wechatProvided: requestObject.selected.wechat
            }
        }}, function(err){
            if(err){
                res.send("failure");
                res.send(500).send(err);
            }else{                           
                //construct the email 
                Ride.find({_id: requestObject.ride_id}, function(err, response){
                    var date = response[0].startTime.getMonth() + 1;
                    date = date + "." + response[0].startTime.getDate();
                    var startTime = response[0].startTime.getHours() + ":" + response[0].startTime.getMinutes();
                    var endTime = response[0].endTime.getHours() + ":" + response[0].endTime.getMinutes();

                    User.find({_id: requestObject.passenger_id}, function(err, passengerRes){
                        
                        var email = requestObject.selected.email? "Email: " + passengerRes[0].email:"";
                        var phone = requestObject.selected.phone? "Phone: " + passengerRes[0].phone:"";
                        var wechat = requestObject.selected.wechat? "Wechat: " + passengerRes[0].wechat: "";
                        res.render(path.resolve('templates/notification.html'),{
                            departure: response[0].departure,
                            destination: response[0].destination,
                            date: date,
                            startTime: startTime,
                            endTime: endTime,
                            email: email,
                            phone:phone,
                            wechat: wechat
                        }, function(err, emailHTML){

                            User.find({_id: response[0].user}, function(err, driverRes){

                                // send email
                                var mailOption = {
                                    to: driverRes[0].email,
                                    from: '"Poolber Support" <support@poolber.ca>',
                                    subject: 'Poolber | Ride Request',
                                    html: emailHTML
                                };

                                smtpTransport.sendMail(mailOption, function(err){
                                    if(!err){
                                        res.send("success");  
                                    }else {
                                        console.log(err);
                                        return res.status(400).send({
                                            message: 'Failure sending email'
                                        });
                                    }
                                });

                                //send text message

                            });
                        });
                    });
                  
                                        
                });                
            }
        });
    }
};
