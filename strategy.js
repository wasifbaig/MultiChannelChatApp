
/*
 * Module dependencies
 */

var http = require('http'),
    fs = require('fs'),
    url = require('url');

var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , GitHubStrategy = require('passport-github').Strategy
  , GoogleStrategy = require('passport-google-oauth2').Strategy;

/**
 * Expose Authentication Strategy
 */

module.exports = Strategy;

/*
 * Defines Passport authentication
 * strategies from application configs
 *
 * @param {Express} app `Express` instance.
 * @api public
 */

function Strategy (app) {
  var config = app.get('config');

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  if(config.auth.twitter.consumerkey.length) {
    passport.use(new TwitterStrategy({
        consumerKey: config.auth.twitter.consumerkey,
        consumerSecret: config.auth.twitter.consumersecret,
        callbackURL: config.auth.twitter.callback
      },
      function(token, tokenSecret, profile, done) {

        return done(null, profile);
      }
    ));
  }

  if(config.auth.facebook.clientid.length) {
    passport.use(new FacebookStrategy({
        clientID: config.auth.facebook.clientid,
        clientSecret: config.auth.facebook.clientsecret,
        callbackURL: config.auth.facebook.callback
      },
      function(accessToken, refreshToken, profile, done) {

        return done(null, profile);
      }
    ));
  }

  if(config.auth.github.clientid.length) {
    passport.use(new GitHubStrategy({
        clientID: config.auth.github.clientid,
        clientSecret: config.auth.github.clientsecret,
        callbackURL: config.auth.github.callback
      },
      function(token, tokenSecret, profile, done) {
          return done(null, profile);
      }
    ));
  }

 if(config.auth.google.clientid.length) {


    passport.use(new GoogleStrategy({
        clientID: config.auth.google.clientid,
        clientSecret: config.auth.google.clientsecret,
        callbackURL: config.auth.google.callback,
        //passReqToCallback   : true
      },

        function(accessToken, refreshToken, profile, done) {
          var querystring = require('querystring');
          var http = require('http');

          var data = querystring.stringify({
              name:  profile.displayName,
              email: profile.displayName,
              pass:  profile.id
          });

          // console.log();
          var options = {
              host: '127.0.0.1',
              port: 1102,
              path: "/uri?name="+profile.displayName.replace(/ /g,'')+"&email="+profile.displayName.replace(/ /g,'')+"&pass="+profile.id.replace(/ /g,''),///uri",//?name="+profile.displayName+"&email="+profile.displayName+"&pass="+profile.id,
              method: 'GET',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Content-Length': Buffer.byteLength(data)
              }
          };

          var req = http.request(options, function(res) {
              res.setEncoding('utf8');
              res.on('data', function (chunk) {
                  console.log("body: " + chunk);
              });
          });
          req.write(data);
          req.end();


            console.log(profile);
            console.log("this is profile");

        return done(null, profile);
      }
    ));
  }

}

