// server.js

var DEV = true; //environment switch for quick translation

//set tools

var express  = require('express');
var app      = express();
var server   = require('http').createServer(app);
var io       = require('socket.io')(server);
var ss 		 = require('socket.io-stream');
var port     = ((DEV) ? 8080 : 80);
var mongoose = require('mongoose');
var passport = require('passport');
var flash	 = require('connect-flash');
var pollHandler = require('./app/poll-handler.js');
var dataHandler = require('./app/data-handler.js');

var morgan 	     = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session		 = require('express-session');

var multer = require('multer');
var profPicStorage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, ((DEV) ? "D:\\www-test\\nodeSite\\public\\uploads" : "C:\\Users\\TITANJC\\www-live\\public\\uploads"));
	},
	filename: function(req, file, cb) {
		cb(null, file.fieldname + '-' + req.user.userData.username + '.png');
	}
});
var serverStorage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, ((DEV) ? "D:\\www-test\\nodeSite\\public\\temp" : "C:\\Users\\TITANJC\\www-live\\public\\temp"));
	},
	filename: function(req, file, cb) {
		cb(null, file.fieldname + '-' + req.user.userData.username + '.zip');
	}
});
var profPicUploader = multer({
	storage : profPicStorage,
	limits: {filesSize: 10000000, files: 1}
});
var serverUploader = multer({
	storage : serverStorage,
	limits : {filesSize: 200000000, files: 1}
})

var configDB = require('./config/database.js');

// Server configuration *******************************************************************
mongoose.connect('mongodb://localhost/USERS'); //connect to DB

require('./config/passport')(passport);

//expression application
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
  limit: '50mb',   
  extended: true
}));
app.use(express.static('public/uploads'));
app.use(express.static('views/css'));

app.set('view engine', 'ejs');

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(passport.initialize());
app.use(passport.session()); //Make login sessions persistent
app.use(flash()); 

//Routes **********************************************************************************
require('./app/routes.js')(app, passport, profPicUploader, serverUploader, io, ss, pollHandler, dataHandler); //load routes and passport

//launch **********************************************************************************
server.listen(port);
console.log('The magic happens on port ' + port);
