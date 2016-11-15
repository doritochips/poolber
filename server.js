var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var morgan = require('morgan')




// middleware
var app = express();


app.use(express.static("public"));
app.use(morgan('dev'));


app.use(session({
    secret: 'foo',
    saveUninitialized: false, // don't create session until something stored 
    resave: false, //don't save session if unmodified 
    store: new MongoStore({
        url: 'mongodb://dev:databasepassword@ds019856.mlab.com:19856/london2toronto'
    })
}));


app.get('/', function(req, res){	
	console.log("reaching: /");
});

app.listen(3000, function(){
	console.log("server on 3000");
})