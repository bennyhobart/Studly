var sql = require('./../config/sql.js');

exports.getWeeklyClass = function (weeklyClassID, callback) {
  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    // Search by subject code
    connection.query('SELECT topicID, userID, username, title, upVotes, downVotes, postTime FROM `Topic` NATURAL JOIN `User` WHERE `weeklyClassID` = ?;', [weeklyClassID], function(err, rows) {
      if(err) {
        connection.release();
        return callback(err);
      }

      // Release the connection
      connection.release();

      // Create a nice setup
      var data = {
        threads: rows,
        video: {
          url: 'http://implementme.com'
        }
      };

      // Run callback
      callback(null, data);
    });
  });
};

exports.addThread = function (req, res) {

};

exports.deleteThread = function (req, res) {

};

exports.attendClass = function (req, res) {

};
