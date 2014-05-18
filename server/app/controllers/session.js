// Load SQL
var sql = require('./../sql.js');
var passport = require('passport');

exports.me = function (req, res) {

};

// Logs a user in
exports.login = function (req, res) {
    if(req.isAuthenticated()) {
        res.json(400, { error: 'You are already logged in.' });
        return;
    }

    passport.authenticate('local', function(err, user, info) {
        if (err || !user) {
            res.json(400, { error: 'Username or password is incorrect.' });
            return;
        }
        req.logIn(user, function(err) {
            if (err) {
                res.json(400, { error: 'Username or password is incorrect.' });
            }
            res.json({ success: 1 })
        });
    })(req, res);
};

// Logs a user out
exports.logout = function (req, res) {
    // Check if the user is logged in
    if(!req.isAuthenticated()) {
        res.json(400, { error: 'You are not logged in.' });
        return;
    }

    // Log out
    req.logout();

    // Send success message
    res.json({ success: 1 });
};
