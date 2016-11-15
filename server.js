var express = require('express');
var app = express();
var morgan = require('morgan')

app.use(express.static("public"));
app.use(morgan('dev'));

app.get('/', function(req, res){	
	console.log("reaching: /");
});

app.listen(3000, function(){
	console.log("server on 3000");
})