/*
 * Module dependencies
 */

var express = require('express')
  , init = require('./init');
  

/*
 * Create and config server
 */

var app = exports.app = express();


/** Database connection */
var dbConfig = require('./db.js');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);
/* */

/**
 * Configure application
 */

require('./config')(app);


/*
 * Passportjs auth strategy
 */

require('./strategy')(app);


/*
 * Routes
 */

require('./routes')(app);

/*
 * Web server
 */

if(app.get('config').credentials) {
  exports.server = require('https')
  .createServer(app.get('config').credentials, app).listen(app.get('port'), function() {

  });
} else {
  exports.server = require('http')
  .createServer(app).listen(app.get('port'), function() {
    
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



