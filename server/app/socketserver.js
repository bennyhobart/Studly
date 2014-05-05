var passportSocketIo = require('passport.socketio');

module.exports = function(io, cookieParser, key, secret, sessionStore) {
    io.set('authorization', passportSocketIo.authorize({
        cookieParser: cookieParser,
        key:    key,
        secret: secret,
        store:  sessionStore,
        success:onAuthorizeSuccess,
        fail:   onAuthorizeFail
    }))

    function onAuthorizeSuccess(data, accept){
        console.log('successful connection to socket.io!');
        accept(null, true);
    }

    function onAuthorizeFail(data, message, error, accept) {
        if(error) throw new Error(message);
        console.log('failed connection to socket.io:', message);
        accept(null, false);
    }

    io.sockets.on('connection', function(socket) {
        /* FILL IN SOCKET LISTENERS HERE */
        socket.on("hi", function(data, fn) {
            fn('hi back!');
        })
    });
}