var sql = require('./../config/sql.js');

exports.me = function (req, res) {

};

exports.getPublicProfile = function (userID, callback) {
  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    connection.query('SELECT `username` FROM `User` WHERE `userID` = ? LIMIT 1;', [userID], function(err, rows) {
      if(err) {
        connection.release();
        return callback(err);
      }

      // Release the connection
      connection.release();

      // Run callback
      callback(null, rows);
    });
  });
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

exports.updatePassword = function (userID, oldPassword, newPassword, callback) {
  // Encypte passwords
  oldPassword = sql.encryptePassword(oldPassword);
  newPassword = sql.encryptePassword(newPassword);

  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    connection.query('UPDATE `User` SET `password` = ? WHERE `userID`=? AND `password`=?', [newPassword, userID, oldPassword], function(err, result) {
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

