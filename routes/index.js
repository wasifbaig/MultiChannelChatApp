
/*
 * Module dependencies
 */

var passport = require('passport')
  , utils = require('../utils');
var LocalStrategy = require('passport-local').Strategy;

/**
 * Expose routes
 */

module.exports = Routes;

/**
 * Defines routes for application
 *
 * @param {Express} app `Express` instance.
 * @api public
 */

function Routes (app) {
  var config = app.get('config');
  var client = app.get('redisClient');
  
  /*
   * Homepage
   */

  app.get('/', function(req, res, next) {

      if(!req.user) {
          res.render('login');
          res.render('login');
      }
      else
      {
           res.render('rooms', { userName: req.user.displayName });
          res.redirect('/rooms');
      }

    if(req.isAuthenticated()){

        var userStr = '';
        if(req.user.provider === 'facebook')
            userStr = req.user.provider + ":" + req.user.displayName +":"+ req.user.id;
        else
            userStr = req.user.provider + ":" + req.user.username +":"+ req.user.username;


      client.hmset(
          'users:' + userStr
        , req.user
      );
      res.redirect('/rooms');
    } else{
      res.render('index');
    }

  });










    app.get('/login', function(req, res, next) {
        res.render('login');
    });

    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/' }),
        function(req, res) {


            res.redirect('/');
        }

    );


    app.get('/logout', function(req, res, next){
        req.logout();
        res.redirect('/');
    });












    /*
     * Authentication routes
     */

  if(config.auth.twitter.consumerkey.length) {
    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', 
      passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/'
      })
    );
  }

  if(config.auth.facebook.clientid.length) {
    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback', 
      passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/'
      })
    );
  }

  if(config.auth.github.clientid.length) {
    app.get('/auth/github', passport.authenticate('github'));

    app.get('/auth/github/callback', 
      passport.authenticate('github', {
        successRedirect: '/',
        failureRedirect: '/'
      })
    );
  }
  
    if(config.auth.google.clientid.length) {
    app.get('/auth/google', passport.authenticate('google',{ scope: ['profile','email']}
    ));

    app.get('/auth/google/callback', 
      passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/'
      })
    );
  }

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  /*
   * Rooms list
   */

  app.get('/rooms', utils.restrict, function(req, res) {
    utils.getPublicRoomsInfo(client, function(rooms) {
      res.render('room_list', { rooms: rooms });
    });
  });

  
   /*
   * Drawing Page
   */
  
    app.get('/:id/drawing', utils.restrict, function(req, res) {

     utils.getRoomInfo(req, res, client, function(room) {
      utils.getUsersInRoom(req, res, client, room, function(users) {
        utils.getPublicRoomsInfo(client, function(rooms) {
          utils.getUserStatus(req.user, client, function(status) {
            
              res.locals({
                    room: room,
                    rooms: rooms,
                    user: {
                      nickname: "danial",//req.user.username
                      provider: req.user.provider,
                      status: status
                    },
                    users_list: users
                });
            
            res.render('drawing');
            
          });
        });
      });
    });
    
  });
  
  
  /*
   * Create a rooom
   */

  app.post('/create', utils.restrict, function(req, res) {
    utils.validRoomName(req, res, function(roomKey) {
      utils.roomExists(req, res, client, function() {
        utils.createRoom(req, res, client);
      });
    });
  });

  /*
   * Join a room
   */

  app.get('/:id', utils.restrict, function(req, res) {
    utils.getRoomInfo(req, res, client, function(room) {
      utils.getUsersInRoom(req, res, client, room, function(users) {
        utils.getPublicRoomsInfo(client, function(rooms) {
          utils.getUserStatus(req.user, client, function(status) {
            utils.enterRoom(req, res, room, users, rooms, status);
          });
        });
      });
    });
  });




}










