/*
 * Module dependencies
 */
 
 /*const MongoClient = require('mongodb').MongoClient

 MongoClient.connect('mongodb://localhost/chat', (err, database) => {
  if (err) return console.log(err)
    db = database
  app.listen(3000, function() {
    console.log('Mongodb is listening on 3000')
  })
})*/

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



