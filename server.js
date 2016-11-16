// Dependencies
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
// files


// middleware

app.use(express.static("public"));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://dev:databasepassword@ds019856.mlab.com:19856/london2toronto');



// import ride controller APIs
var ride = require('./controllers/ride.controller.server.js');
app.post('/ride', ride.post);
app.get('/ride/:title.:format?', ride.show);
app.get('/ride', ride.list);



app.get('/', function(req, res){	
	console.log("reaching: /");
});

app.listen(3000, function(){
	console.log("server on 3000");
})

