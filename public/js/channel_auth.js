
/*
 * Module dependencies
 */

var passport = require('passport')
  , utils = require('../utils');

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