
/*
 * Module dependencies
 */

var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , GitHubStrategy = require('passport-github').Strategy
  , GoogleStrategy = require('passport-google-oauth2').Strategy
  , expressSession = require('express-session')
  , LocalStrategy = require('passport-local')
  , User = require('./Model/user')
  , bCrypt = require('bcrypt-nodejs')
  , fs = require('fs');

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
      function(token, tokenSecret, profile, done) {
        return done(null, profile);
      }
    ));
  }
  
  
  passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
      
     req.session.errorMsg = '';  
      
    // check in mongo if a user with username exists or not
    User.findOne({ 'username' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method

        //req.session.loginMsg = 'asasasasas';
        if (err){
          return done(err);
          req.session.errorMsg = err;
          }
        // Username does not exist, log error & redirect back
        if (!user){
            //res.end("User Not Found");
          //console.log('User Not Found with username '+username);
           req.session.errorMsg = "User Not Found";
          return done(null, false,'');                 
        }
        // User exists but wrong password, log the error 
        if (!isValidPassword(user, password)){
          //console.log('Invalid Password');
          //res.end("Invalid Password");
          req.session.errorMsg = "Invalid Password";
          return done(null, false,'');
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user);
      }
    );
}));
  
  passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {

       req.session.errorMsg = ''; 

    findOrCreateUser = function(){
        
        
      // find a user in Mongo with provided username
      User.findOne({'username':username},function(err, user) {
          
           
        // In case of any error return
        if (err){
          console.log('Error in SignUp: '+err);
          req.session.errorMsg = err; 
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists');
          req.session.errorMsg = 'User Already Exists';   
          return done(null, false,'');
          
             
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();
          // set the user's local credentials
          newUser.name = req.param('name');
          newUser.username = username;
          newUser.password = createHash(password);

 
          // save the user
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+err);  
              req.session.errorMsg = 'Error in Saving user: '+err;
              throw err;  
            }
            
            
            console.log('User Registration succesful');    
            return done(null, newUser);
          });
        }
      });
    };
     
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  }));

  
  
  var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}
  
  
// Generates hash using bCrypt
var createHash = function(password){
 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}  
  
}

