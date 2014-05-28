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

exports.deleteThread = function (req, res) {

};

exports.attendClass = function(userID, weeklyClassID, state, callback) {
  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    // Create the post
    connection.query('INSERT INTO `Attended` (`userID`, `weeklyClassID`, `state`) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE state=?;', [userID, weeklyClassID, state, state], function(err, result) {
      if(err) {
        connection.release();
        return callback(err);
      }

      // Release the connection
      connection.release();

      // Run callback
      callback(null);
    });
  });
};

exports.getPosts = function(topicID, callback) {
  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    // Search by subject code
    connection.query('SELECT postID, userID, username, content, postTime FROM `Post` NATURAL JOIN `User` WHERE `topicID` = ?;', [topicID], function(err, rows) {
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

exports.addThread = function(userID, weeklyClassID, title, content, callback) {
  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    // Search by subject code
    connection.query('INSERT INTO `Topic` (`userID`, `weeklyClassID`, `title`, `upVotes`, `downVotes`, `postTime`) VALUES (?, ?, ?, 0, 0, NOW());', [userID, weeklyClassID, title], function(err, result) {
      if(err) {
        connection.release();
        return callback(err);
      }

      // Grab the topicID
      var topicID = result.insertId;

      // Create the post
      connection.query('INSERT INTO `Post` (`topicID`, `userID`, `content`, `postTime`) VALUES(?, ?, ?, NOW());', [topicID, userID, content], function(err, result) {
        if(err) {
          connection.release();
          return callback(err);
        }

        // Release the connection
        connection.release();

        // Run callback
        callback(null, topicID);
      });
    });
  });
};

exports.addPost = function(userID, topicID, content, callback) {
  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    // Create the post
    connection.query('INSERT INTO `Post` (`topicID`, `userID`, `content`, `postTime`) VALUES(?, ?, ?, NOW());', [topicID, userID, content], function(err, result) {
      if(err) {
        connection.release();
        return callback(err);
      }

      // Release the connection
      connection.release();

      // Grab the postID
      var postID = result.insertId;

      // Run callback
      callback(null, postID);
    });
  });
}