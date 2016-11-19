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
    console.log('Balloons.io started on port %d', app.get('port'));
  });
} else {
  exports.server = require('http')
  .createServer(app).listen(app.get('port'), function() {
    console.log('Balloons.io started on port %d', app.get('port'));
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


//////////////////////////////////////////////////////////
///////////////////// Drawing Code
//////////////////////////////////////////////////////////


// Including libraries

var app1 = require('http').createServer(handler),
	io1 = require('socket.io').listen(app1),
	static = require('node-static'); // for serving files

// This will make all the files in the current folder
// accessible from the web
var fileServer = new static.Server('./');
	
// This is the port for our web server.
// you will need to go to http://localhost:8080 to see it
app1.listen(8080);

// If the URL of the socket server is opened in a browser
function handler (request, response) {

        request.addListener('end', function () {
            fileServer.serve(request, response);
        }).resume();
        
}

// Delete this row if you want to see debug messages
//io.set('log level', 1);

// Listen for incoming connections from clients
io1.sockets.on('connection', function (socket) {

	// Start listening for mouse move events
	socket.on('mousemove', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
		socket.broadcast.emit('moving', data);
	});
});


