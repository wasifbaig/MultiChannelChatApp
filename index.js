var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

/*
 * Module dependencies
 */

var express = require('express')
  , init = require('./init')

/*
 * Create and config server
 */

var app = exports.app = express();

/**
 * Configure application
 */

require('./config')(app);
require('./app_session') ;

// var mongoUtil = require( './db_mongo' );

/*
 * Clean db and create folder
 */

// init(app.get('redisClient'));

/*
 * Passportjs auth strategy
 */

require('./strategy')(app);


/*
 * Routes
 */

require('./routes')(app);
var user = require('./routes/RegUser');
var luser = require('./routes/LognUser');


/*
 * Web server
 */

if(app.get('config').credentials) {
  exports.server = require('https')
  .createServer(app.get('config').credentials, app).listen(app.get('port'), function() {
    console.log('Multichannel chat application started on port %d', app.get('port'));
  });
} else {
  exports.server = require('http')
  .createServer(app).listen(app.get('port'), function() {
    console.log('Multichannel chat application started on port %d', app.get('port')); // for the console operations 
  });
}

/*
 * Socket.io
 */

require('./sockets')(app, exports.server);


/*
 * Catch uncaught exceptions
 */

process.on('uncaughtException', function(err){
  console.log('Exception: ' + err.stack);
});






