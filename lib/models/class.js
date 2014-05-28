var sql = require('./../config/sql.js');

exports.getWeeklyClass = function (weeklyClassID, callback) {
  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    // Try to find this weekly class
    connection.query('SELECT `subjectCode`, `subjectName`, `sortName`, `echoLink`, `baseLink`, `duration`, `classID`, `subjectID` FROM `WeeklyClass` `W` NATURAL JOIN `Class` NATURAL JOIN `Subject` NATURAL JOIN `ClassSort` LEFT JOIN `WeeklyClassRecording` `R` ON `W`.`weeklyClassID` = `R`.`weeklyClassID` WHERE `W`.`weeklyClassID`=? LIMIT 1;', [weeklyClassID], function(err, rows) {
      if(err) {
        connection.release();
        return callback(err);
      }

      // Make sure the subjeect exists
      if(rows.length == 0) {
        callback(new Error('weekly class not found!'));
        return;
      }

      var thumbs = [];

      // Grab the first row
      var r = rows[0];

      // Create a nice setup
      var data = {
        classInfo: {
          subjectName: r.subjectName,
          subjectCode: r.subjectCode,
        }
      }

      // Check if we found a video
      if(r.baseLink) {
        data.video = {};
        data.video.url = r.baseLink+'/audio-vga.m4v';
        data.video.baseSlides = r.baseLink+'/thumbnails/';
        data.video.slides = thumbs;
      }

      // Search by subject code
      connection.query('SELECT topicID, userID, username, title, upVotes, downVotes, postTime FROM `Topic` NATURAL JOIN `User` WHERE `weeklyClassID` = ?;', [weeklyClassID], function(err, rows) {
        if(err) {
          connection.release();
          return callback(err);
        }

        // Create a nice setup
        data.threads = rows;

        if(r.lectureLink) {
          // Find the slides
          connection.query('SELECT `thumbNail` FROM `WeeklyClassThumbs` WHERE `weeklyClassID` = ?;', [weeklyClassID], function(err, rows) {
            if(err) {
              connection.release();
              return callback(err);
            }

            // Release the connection
            connection.release();

            // Loop over all rows
            for(var key in rows) {
              var row = rows[key];
              thumbs.push(row.thumbNail);
            }

            // Run callback
            callback(null, data);
          });

        } else {
          // Release the connection
          connection.release();

          // Run callback
          callback(null, data);
        }
      });
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
};

exports.voteOnTopic = function(userID, topicID, newVote, callback) {
  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    // Attempt to find any old votes
    connection.query('SELECT `vote`, `upVotes`, `downVotes` FROM `Topic` LEFT JOIN `TopicVotes` ON `Topic`.`TopicID` = `TopicVotes`.`TopicID` WHERE `Topic`.`topicID`=? AND `TopicVotes`.`userID`=? LIMIT 1;', [topicID, userID], function(err, rows) {
      if(err) {
        connection.release();
        return callback(err);
      }

      // Ensure the topic was found
      if(rows.length <= 0) {
        connection.release();
        return callback(new Error('That topic does not exist!'));
      }

      // Grab the old vote
      var oldVote = rows[0].vote || 0;

      // Check if the vote is the same
      if(oldVote == newVote) {
        callback(null, rows[0].upVotes, rows[0].downVotes);
        return;
      }

      // Calcualte how to change up and down
      var ups = 0;
      var downs = 0;

      if(oldVote == 0) {
        if(newVote == 1) {
          ups = 1;
        } else {
          downs = 1;
        }
      } else if(oldVote == 1) {
        if(newVote == 0) {
          ups = -1;
        } else {
          ups = -1;
          downs = 1;
        }
      } else {
        if(newVote == 1) {
          ups = 1;
          downs = -1;
        } else {
          downs = -1;
        }
      }

      var newUps = rows[0].upVotes + ups;
      var newDowns = rows[0].downVotes + downs;

      // Apply the new vote
      connection.query('UPDATE `Topic` SET `upVotes`=`upVotes`+?, `downVotes`=`downVotes`+?;', [ups, downs], function(err, rows) {
        if(err) {
          connection.release();
          return callback(err);
        }

        // Store this user's vote
        connection.query('INSERT INTO `TopicVotes` (`topicID`, `userID`, `vote`) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE `vote` = ?;', [topicID, userID, newVote, newVote], function(err, rows) {
          if(err) {
            connection.release();
            return callback(err);
          }

          // Free the connection
          connection.release();

          // Run the callback
          callback(null, newUps, newDowns);
        });
      });
    });
  });
};
