var model = require('./../models/user.js');
var sessionModel = require('./../models/session.js');

exports.me = function (req, res) {

};

exports.getPublicProfile = function (req, res) {
  var userID = req.params['userID'];
  if(!userID) {
    res.json(403, { error: 'No userID passed.' });
    return;
  }

  model.getPublicProfile(userID, function(err, data) {
    if(err) {
      res.json(403, { error: 'Something went wrong with the query.' });
      return;
    }

    // Did we find the user?
    if(data.length == 0) {
      res.json(403, { error: 'User with that ID was not found' });
      return;
    }

    // Give them the data
    res.json(data[0]);
  });
};

exports.register = function (req, res) {
  // Check if they are logged in
  if(req.isAuthenticated()) {
      // Logged in people shouldn't need to register
      res.json(403, { error: 'You already have an account!' });
      return;
  }

  // Grab details for registeration
  var username = req.body['username'];
  var email = req.body['email'];
  var password = req.body['password'];

  // Check if a username was entered
  if(!username) {
    res.json(400, { error: 'No username entered.' });
    return;
  }

  // Check if an email was entered
  if(!email) {
    res.json(400, { error: 'No email entered.' });
    return;
  }

  // Check if a password was entered
  if(!password) {
    res.json(400, { error: 'No password entered.' });
    return;
  }

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
      // Grab the error message
      var m = err.message;

      // Check if there was a duplicate value
      if(m.indexOf('ER_DUP_ENTRY') != -1) {
        // Check if it was username or email
        if(m.indexOf('username') != -1) {
          // Username was taken
          res.json(400, { error: 'That username is already taken.' });
          return;
        } else if(m.indexOf('email') != -1) {
          // Email was taken
          res.json(400, { error: 'That email is already taken.' });
          return;
        }
      }

      // Failure, send fail message
      res.json(400, { error: 'Something went from with the database :(' });
    } else {
      // It worked, send success message
      //res.json({ userID: userID });

      // Attempt to login:
      sessionModel.login(req, res);
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
  var userID = req.user.userID;//req.body['username'];
  var oldPassword = req.body['oldPassword'];
  var newPassword = req.body['newPassword'];

  // Check if a username was entered
  if(!userID) {
    res.json(400, { error: 'userID was not found.' });
    return;
  }

  // Check if their old password was entered
  if(!oldPassword) {
    res.json(400, { error: 'No old password entered.' });
    return;
  }

  // Check if their new password was entered
  if(!newPassword) {
    res.json(400, { error: 'No new password entered.' });
    return;
  }

  // Validate length of new password?

  // Make sure passwords match
  if(newPassword != req.body['newPasswordRepeated']) {
      res.json(400, { error: 'Passwords do not match.' });
      return;
  }

  // Update a user's password
  model.updatePassword(userID, oldPassword, newPassword, function(err, success) {
    if(err || !success) {
      res.json(400, { error: 'You entered your password incorrectly.' });
      return;
    }

    // It worked, send success message
    res.json({ success: 1 });
  });
};

