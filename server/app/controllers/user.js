// Load SQL
var sql = require('./../sql.js');

// Returns the user's username and email
exports.me = function (req, res) {
    // Check if the user is logged in
    if(req.isAuthenticated()) {
        // Logged in, send them their info
        res.json({
            username: req.user.username,
            email: req.user.email
        })
    } else {
        // Not logged in, send error
        res.json(403, { error: 'You are not logged in.' });
    }
};

exports.getPublicProfile = function (req, res) {
    var userID = req.query['userID'];
    sql.userByID(userID, function(err, data) {
        if(err || !data) {
            res.json(400, { error: 'User with that ID not found.' });
            return;
        }

        // Send the user's info
        res.json({
            username: data.username
        });
    });
};

exports.register = function (req, res) {
    // Check if they are logged in
    if(req.isAuthenticated()) {
        // Logged in people shouldn't need to register
        res.json(403, { error: 'You already have an account!' });
        return;
    }

    var username = req.body['username'];
    var email = req.body['email'];
    var password = req.body['password'];

    // Check length of username and password (FILL ME IN)

    // Check syntax of email (FILL ME IN) (Are we only accepting UoM emails?)

    // Validate passwords
    if(password != req.body['passwordRepeated']) {
        res.json(400, { error: 'Passwords do not match.' });
        return;
    }

    // Attempt to create the account
    sql.createUser(username, password, email, function(err, userID) {
        if(err) {
            console.log(err);
            res.json(400, { error: 'That username is already taken.' });
            return;
        }

        // It worked, send success message
        res.json({ success: 1 });
    });
};

exports.deregister = function (req, res) {
    // Do we even support this?

    // Maybe we just hide their acc? idk
};

exports.updatePassword = function (req, res) {
    // Updates a user's password
    if(!req.isAuthenticated()) {
        res.json(400, { error: 'You are not logged in.' });
        return;
    }

    // Grab useful stuff
    var username = req.body['username'];
    var oldPassword = req.body['oldPassword'];
    var newPassword = req.body['newPassword'];

    // Validate length of new password?

    // Make sure passwords match
    if(newPassword != req.body['newPasswordRepeated']) {
        res.json(400, { error: 'Passwords do not match.' });
        return;
    }

    // Update a user's password
    sql.updateUserPassword(username, oldPassword, newPassword, function(err, success) {
        if(err || !success) {
            res.json(400, { error: 'You entered your password incorrectly.' });
            return;
        }

        // It worked, send success message
        res.json({ success: 1 });
    });
};

