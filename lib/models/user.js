var sql = require('./../config/sql.js');

exports.me = function (req, res) {

};

exports.getPublicProfile = function (req, res) {

};

exports.register = function (username, password, email, callback) {
  // Attempt to create

  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    // Encrypt password
    password = sql.encryptePassword(password);

    connection.query('INSERT INTO `User` (`username`, `password`, `email`) VALUES (?, ?, ?)', [username, password, email], function(err, result) {
      if(err) {
        connection.release();
        return callback(err);
      }

      // Release the connection
      connection.release();

      // Grab useful info
      var userID = result.insertId;

      // Run callback
      callback(null, userID);
    });
  });
};

exports.deregister = function (req, res) {

};

exports.updatePassword = function (username, oldPassword, newPassword, callback) {
  // Encypte passwords
  oldPassword = sql.encryptePassword(oldPassword);
  newPassword = sql.encryptePassword(newPassword);

  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    connection.query('UPDATE `User` SET `password` = ? WHERE `username`=? AND `password`=?', [newPassword, username, oldPassword], function(err, result) {
      if(err) {
        connection.release();
        return callback(err);
      }

      // Release the connection
      connection.release();

      // Run callback
      callback(null, (result.affectedRows>0));
    });
  });
};

