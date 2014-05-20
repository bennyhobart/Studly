var model = require('./../models/session.js');

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

exports.login = function (req, res) {
  // Check if the user is already validated
  if(req.isAuthenticated()) {
    res.json(400, { error: 'You are already logged in.' });
    return;
  } else {
    // Authenticate the user
    console.log(req.body);
    model.login(req, res);
    res.json(200, { message: 'You are now logged in' });
  }
};

exports.logout = function (req, res) {
  // Check if the user is logged in
  if(!req.isAuthenticated()) {
    res.json(400, { error: 'You are not logged in.' });
    return;
  } else {
    // Log out
    req.logout();

    // Send success message
    res.json({ success: 1 });
  }
};
