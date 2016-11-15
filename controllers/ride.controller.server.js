var Ride = require('../models/ride.model.server.js');
var User = require('../models/user.model.server.js');

exports.post = function(req, res) {
    new Ride({title: req.body.title, author: req.body.author}).save();
};

exports.list = function(req, res) {
  Ride.find(function(err, threads) {
    res.send(threads);
  });
};

exports.show = (function(req, res) {
    Ride.findOne({title: req.params.title}, function(error, thread) {
        var posts = Post.find({thread: thread._id}, function(error, posts) {
          res.send([{thread: thread, posts: posts}]);
        });
    })
});