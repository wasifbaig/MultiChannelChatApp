var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Configuring Passport
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db/login');

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke callback `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
    function(username, password, cb) {
        db.findByUsername(username, function(err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.password != password) { return cb(null, false); }
            return cb(null, user);
        });
    }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize usersusers out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    db.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());


// API routes
// app.get('/', function(req, res, next) {
//     if(!req.user) {
//         res.render('login');
//         console.log('73');
//     }
//     else
//         res.render('index', { userName: req.user.displayName });
// });
//
// app.get('/login', function(req, res, next) {
//     res.render('login');
//     console.log("162 strategy");
// });
//
// app.post('/login',
//     passport.authenticate('local', { failureRedirect: '/' }),
//     function(req, res) {
//         res.redirect('/');
//     }
//
// );
//
// app.get('/signup', function(req, res, next) {
//     res.render('signup');
// });
//
// app.post('/signup', function(req, res, next) {
//     console.log(req.body);
//     db.addUser(req.body);
//     res.redirect('/');
// });
//
// app.get('/logout', function(req, res, next){
//     req.logout();
//     res.redirect('/');
// });
//

module.exports = app;
