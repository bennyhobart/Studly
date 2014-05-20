var sql = require('./../config/sql.js');
var passport = require('passport');

// authenticate a user
exports.login = function(req, res) {
  // Attempt to authenticate the user
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) {
      res.json(400, { error: 'Username or password is incorrect.' });
      return;
    }
    req.logIn(user, function(err) {
      if (err) {
        res.json(400, { error: 'Username or password is incorrect.' });
      }
      // They are logged in, give them their details
      res.json({
        success: 1,
        username: req.user.username,
        email: req.user.email
      })
    });
  })(req, res);
};
