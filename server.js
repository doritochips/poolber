// Dependencies
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var app = express();
// files



// middleware

//should put one in the callback of the other for them to run in parallel
app.use(express.static("app"));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
// Add passport's middleware
app.use(passport.initialize());
app.use(passport.session());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://dev:databasepassword@ds019856.mlab.com:19856/london2toronto');

//Database models
require('./models/ride.model.server.js');
require('./models/user.model.server.js');

//Config files
require('./config/passport.config.server.js')(passport);


//require all routes
require('./routes')(app);

app.listen(3000, function(){
	console.log("server on 3000");
})

