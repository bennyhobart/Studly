'use strict';

/*
 * Express Dependencies
 */
var express = require('express'),
    passport = require('passport'),
    socketio = require('socket.io'),
    compress = require('compression'),
    cookieParser = require('cookie-parser'),
    http = require('http');


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
var sessionStore = null; //TODO: Ash Database

// Set Handlebars
app.set('view engine', 'handlebars');

/*
 * Routes
 */
// Index Page
app.get('/', function(request, response, next) {
    response.sendfile("index.html")
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