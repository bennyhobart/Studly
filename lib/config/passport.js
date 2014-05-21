var passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    bodyParser = require('body-parser')
    sql = require('./sql.js'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    sessionStore = require('express-mysql-session');

module.exports = function(app) {
  // Setup SQL Based Session
  app.use(cookieParser());
  app.use(session({
    key: 'session_cookie_name',
    secret: '~\'f.vd\'L<^Snn![7"`+;+h*"=_2Z^neG',
    store: new sessionStore(sql.getSessionOptions())
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Setup passport
  passport.use(new localStrategy(
    function(username, password, done) {
      // Attempt to validate this user
      sql.validateUser(username, password, function(err, data) {
        if (err) return done(err);

        // Check if user account was found
        if(data.userID == -1) {
          // Invalid user
          return done(null, false, { message: 'Incorrect username or password.' });
        } else {
          // Valid user
          return done(null, data);
        }
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, JSON.stringify(user));
  });

  passport.deserializeUser(function(userJson, done) {
    done(null, JSON.parse(userJson));
  });

  // Needed for POST requests
  app.use(bodyParser());
  app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

}