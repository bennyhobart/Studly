var model = require('./../models/user.js');

exports.me = function (req, res) {

};

exports.getPublicProfile = function (req, res) {

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
  model.register(username, password, email, function(err, userID) {
    if(err) {
      // Failure, send fail message
      res.json(400, { error: 'That username is already taken.' });
    } else {
      // It worked, send success message
      res.json({ userID: userID });
    }
  });
};

exports.deregister = function (req, res) {

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

  console.log(username);

  // Validate length of new password?

  // Make sure passwords match
  if(newPassword != req.body['newPasswordRepeated']) {
      res.json(400, { error: 'Passwords do not match.' });
      return;
  }

  // Update a user's password
  model.updatePassword(username, oldPassword, newPassword, function(err, success) {
    if(err || !success) {
      res.json(400, { error: 'You entered your password incorrectly.' });
      return;
    }

    // It worked, send success message
    res.json({ success: 1 });
  });
};

