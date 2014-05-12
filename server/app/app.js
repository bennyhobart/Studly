'use strict';

/*
 * Express Dependencies
 */
var express = require('express'),
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    socketio = require('socket.io'),
    compress = require('compression'),
    cookieParser = require('cookie-parser'),
    http = require('http'),
    session = require('express-session'),
    sessionStore = require('express-mysql-session');

/*
 * SQL
 */
var sql = require('./sql.js');

var app = express();
var port = 3000;

/*
 * Use Handlebars for templating
 */
var exphbs = require('express3-handlebars');
var hbs;

// For gzip compression
app.use(compress());

/*
 * Config for Production and Development
 */
if (process.env.NODE_ENV === 'production') {
    // Set the default layout and locate layouts and partials
    app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        layoutsDir: 'dist/views/layouts/',
        partialsDir: 'dist/views/partials/'
    }));

    // Locate the views
    app.set('views', __dirname + '/dist/views');

    // Locate the assets
    app.use(express.static(__dirname + '/dist/assets'));

} else {
    app.engine('handlebars', exphbs({
        // Default Layout and locate layouts and partials
        defaultLayout: 'main',
        layoutsDir: 'views/layouts/',
        partialsDir: 'views/partials/'
    }));

    // Locate the views
    app.set('views', __dirname + '/views');

    // Locate the assets
    app.use(express.static(__dirname + '/assets'));
    // Points to the Client-Side App
    app.use(express.static('./' + __dirname + '/client'));
}

/* App Configurations */
var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];

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

/*
Should probably change these two
*/
passport.serializeUser(function(user, done) {
    done(null, JSON.stringify(user));
});

passport.deserializeUser(function(userJson, done) {
    done(null, JSON.parse(userJson));
});

/*
SQL SESSION TEST CODE
*/

app.get('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            sql.createUser(req.query['username'], req.query['password'], 'some_email@some_website.com', function(err, userID) {
                if(err) {
                    res.send('I failed to log you in, and that username seems to be taken, sorry :(');
                } else {
                    res.send('You couldnt be logged in, but on the bright side, I made you an account :D Try again now...');
                }
            });
            return;
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.send('You are logged in as ' + user.username+' <a href="/">Back</a>');
        });
    })(req, res, next);
});

/*
END SQL SESSION TEST CODE
*/

// Set Handlebars
app.set('view engine', 'handlebars');

/*
 * Routes
 */
// Index Page
app.get('/', function(req, res, next) {
    if(req.isAuthenticated()) {
        res.send('You are logged in as ' + req.user.username);
    } else {
        res.sendfile("index.html")
    }

});

/*
 * API Handling
 */

require('./api')
    (app,
        passport);

var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('Studly listening on port ' + app.get('port'));
})

/*
 * Socket Handling
 */
var io = socketio.listen(server);
require('./socketserver')
    (io,
        cookieParser,
        config.sessionkey,
        config.sessionsecret,
        sessionStore);

/*
 * Start it up
 */
app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);