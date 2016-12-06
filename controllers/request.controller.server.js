var _ = require('lodash');
var Request = require('../models/request.model.server.js');
var User = require('../models/user.model.server.js');
var mongoose = require("mongoose");

exports.post = function(req, res) {    
    console.log(req.body);
	var newRequest = new Request(req.body);          
    newRequest.user = {_id: req.body.user_id};
    newRequest.save(function(err) {
    	if (err){
            console.log(err);
    		res.status(400).send({
                message: 'Some error occured when saving the post!'
            })
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
        })
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
}

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
    })
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
        })
    }

    Request.findById(id).populate('requestr', displayName).exec(function(err, request){
        if (err){
            return next(err);
        }
        else if (!request){
            return res.status(404).send({
                message: 'No request has been found'
            });
        }
        req.request = request;
        next()
    });
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
