"use strict";

var _ = require('lodash');
var path = require('path');
var Request = require('../models/request.model.server.js');
var User = require('../models/user.model.server.js');
var mongoose = require("mongoose");
var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport('smtps://poolbercanada%40gmail.com:devpassword@smtp.gmail.com');

exports.post = function(req, res) {    
    console.log(req.body);
	var newRequest = new Request(req.body);          
    newRequest.user = {_id: req.body.user_id};
    newRequest.save(function(err) {
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
            message: 'request id is invalid'
        });
    }
    //populate with username
    Request.findById(id).exec(function(err, request){
        if (err){
            return res.status(400).send(err);
        }
        else if (!request){
            return res.status(404).send({
                message: 'No request has been found'
            });
        }else{
            res.json(request);
        }
        
    });
};

exports.update = function(req,res) {
    var request = req.request;
    request.save(function(err){
        if (err){
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(request);
        }
    });
};

exports.list = function(req, res) {
    Request.find().exec(function(err, requests) {
        if (err){
            return res.status(400).send({
                message:err
            });
        }
        else{
            res.json(requests);
        }
    });
};

exports.requestByID = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send({
            message: 'article is invalid'
        });
    }

    Request.findById(id).populate('requestr', 'displayName').exec(function(err, request){
        if (err){
            return next(err);
        }
        else if (!request){
            return res.status(404).send({
                message: 'No request has been found'
            });
        }
        req.request = request;
        next();
    });
};

exports.offerRequest = function(req, res){
    //console.log(req.body);
    var requestObject = req.body;
    Request.findOne({_id: requestObject.ride_id}, function(err, response){
        var exist = false;
        response.driverList.forEach(function(it){
            if(it.userid === requestObject.driver_id){
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
        Request.update({_id: requestObject.ride_id},
        {$push: {'driverList':
            {
                userid: requestObject.driver_id,
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
                Request.find({_id: requestObject.ride_id}, function(err, response){
                    var date = response[0].startTime.getMonth() + 1;
                    date = date + "." + response[0].startTime.getDate();
                    var startTime = response[0].startTime.getHours() + ":" + response[0].startTime.getMinutes();
                    var endTime = response[0].endTime.getHours() + ":" + response[0].endTime.getMinutes();

                    User.find({_id: requestObject.driver_id}, function(err, driverRes){
                        
                        var email = requestObject.selected.email? "Email: " + driverRes[0].email:"";
                        var phone = requestObject.selected.phone? "Phone: " + driverRes[0].phone:"";
                        var wechat = requestObject.selected.wechat? "Wechat: " + driverRes[0].wechat: "";
                        res.render(path.resolve('templates/notification_request.html'),{
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
                                    subject: 'Poolber | Request Request',
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

exports.delete = function(req, res){
    var request = req.request;
    request.remove(function(err) {
        if (err){
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(request);
        }
    });
};
