var _ = require('lodash');
var Request = require('../models/request.model.server.js');
var Ride = require('../models/ride.model.server.js');
var User = require('../models/user.model.server.js');
var mongoose = require("mongoose");

exports.list = function(req,res) {
    var userid = req.params.id;
    //check valid user id
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send({
            message: 'request id is invalid'
        })
    }
    //find all rides posted by this user
    //writen in horrible way, improve with indexed later
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
