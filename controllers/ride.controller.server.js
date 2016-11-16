var Ride = require('../models/ride.model.server.js');
var User = require('../models/user.model.server.js');

exports.post = function(req, res) {
	console.log(req.body);
    new Ride({
    	title: req.body.title
    }).save(function(err) {
    	if (err){
    		console.log(err);
    	}
    	else {
    		res.jsonp(req.body);
    	}
	});
};

exports.list = function(req, res) {
  Ride.find(function(err, rides) {
    res.send(rides);
  });
};

exports.show = (function(req, res) {
    Ride.findOne({title: req.params.title}, function(error, thread) {
        var posts = Post.find({thread: thread._id}, function(error, posts) {
          res.send([{thread: thread, posts: posts}]);
        });
    })
});