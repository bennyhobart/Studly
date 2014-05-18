var mysql = require('mysql');
var crypto = require('crypto');

// Salt used to hash passwords
var secretSalt = 't&\'6H:wLdH{^(7MZ(h6/3TrD>gfR:/qU';

/*var databaseInfo = {
    host     : '127.0.0.1',
    user     : 'studly',
    password : 'studly'
}*/

// Info needed to connect to database
var databaseInfo = {
    host     : 'ash47.net',
    port     : 3306,
    user     : 'studly',
    password : '38)!ou_X[2481UTgs@483f0pfk24nL'
}

// Create a connection pool
var pool = mysql.createPool({
    host     : databaseInfo.host,
    port     : databaseInfo.port,
    user     : databaseInfo.user,
    password : databaseInfo.password,
    database : 'studly'
});

// Test the connection
pool.getConnection(function(err, connection) {
    if(err) {
        console.log('\n\nSQL FAILED TO START!\n');
        throw err;
    } else {
        console.log('SQL seems to be working!');
    }

    // Release the connection
    connection.release();
});

// Returns an object with options needed for session
function getSessionOptions() {
    return {
        host     : databaseInfo.host,
        port     : databaseInfo.port,
        user     : databaseInfo.user,
        password : databaseInfo.password,
        database : 'studly_session'
    }
}

// Encryptes a password (change this = all passwords in db are invalid)
function encryptePassword(password) {
    var md5 = crypto.createHash('md5');
    md5.update(secretSalt+password);
    return md5.digest('hex');
}

// Checks if a username + password combo is valid
function validateUser(username, password, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        var sql = connection.query('SELECT `userID`, `username`, `email` FROM `User` WHERE `username` = ? AND `password` = ? LIMIT 1', [username, encryptePassword(password)], function(err, rows) {
            if(err) {
                connection.release();
                return callback(err);
            }

            // Release the connection
            connection.release();

            var data = {
                userID: -1
            }

            // Grab userID
            if(rows.length>0) {
                data.userID = rows[0].userID;
                data.username = rows[0].username;
                data.email = rows[0].email;
            }

            // Run callback
            callback(null, data);
        });
    });
}

// Checks if the given username is registered
function userExists(username, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('SELECT * FROM `User` WHERE `username` = ? LIMIT 1', [username], function(err, rows) {
            if(err) {
                connection.release();
                return callback(err);
            }

            // Release the connection
            connection.release();

            // Run callback
            callback(null, rows.length>0);
        });
    });
}

// Gets a user by ID
function userByID(userID, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('SELECT `username`, `email` FROM `User` WHERE `userID` = ? LIMIT 1', [userID], function(err, rows) {
            if(err) {
                connection.release();
                return callback(err);
            }

            // Release the connection
            connection.release();

            // Check if that userID was found
            if(rows.length>0) {
                // Give user their data
                callback(null, {
                    username: rows[0].username,
                    email: rows[0].email
                });
                return;
            }

            // Send an error back
            callback(null, null);
        });
    });
}

// Creates an account for the given user
function createUser(username, password, email, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('INSERT INTO `User` (`username`, `password`, `email`) VALUES (?, ?, ?)', [username, encryptePassword(password), email], function(err, result) {
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
}

// Updates a user's password
function updateUserPassword(username, oldPassword, newPassword, callback) {
    // Encypte passwords
    oldPassword = encryptePassword(oldPassword);
    newPassword = encryptePassword(newPassword);

    pool.getConnection(function(err, connection) {
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
}

// Gets a list of semesters for the given year
function getSemesters(year, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('SELECT `semesterID`, `startDate` FROM `Semester` WHERE YEAR(startDate) = ?;', [year], function(err, rows) {
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
}

// Gets a list of weeks for the given semester
function getWeeks(semesterID, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('SELECT `weekID`, `startDate` FROM `SemesterWeek` WHERE `semesterID` = ?;', [semesterID], function(err, rows) {
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
}

function getClasses(subjectID, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('SELECT `classID`, `sort`, `duration` FROM `Class` WHERE `subjectID` = ?;', [subjectID], function(err, rows) {
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
}

// Gets the classes for a given class
function getTimes(classID, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('SELECT `classTimeID`, `day`, `time`, `buildingNumber`, `roomNumber` FROM `ClassTime` WHERE `classID` = ?;', [classID], function(err, rows) {
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
}

// Gets the weekly class for the given classID
function getWeeklyClasses(classID, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('SELECT `weeklyClassID`, `weekNumber` FROM `WeeklyClass` WHERE `classID` = ?;', [classID], function(err, rows) {
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
}

// Finds threads for the given weeklyClassID
function findTopics(weeklyClassID, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('SELECT `topicID`, `userID`, `title`, `upVotes`, `downVotes`, `postTime` FROM `Topic` WHERE `weeklyClassID` = ?;', [weeklyClassID], function(err, rows) {
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
}

// Finds all posts for the given topicID
function findPosts(topicID, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('SELECT `postID`, `userID`, `content`, `postTime`, `editTime` FROM `Post` WHERE `topicID` = ?;', [topicID], function(err, rows) {
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
}

// Register a user into a subject
function registerUserIntoSubject(userID, subjectID, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('INSERT IGNORE INTO `UserSubject` (`userID`, `subjectID`) VALUES (?, ?);', [userID, subjectID], function(err, result) {
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
}

// Remove a user from a subject
function removeUserFromSubject(userID, subjectID, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('DELETE FROM `UserSubject` WHERE `userID` = ? AND subjectID = ? LIMIT 1;', [userID, subjectID], function(err, result) {
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
}

// Registers a user into a given class time
function registerUserIntoClassTime(userID, classTimeID, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('INSERT IGNORE INTO `UserClassTime` (`userID`, `classTimeID`) VALUES (?, ?);', [userID, classTimeID], function(err, result) {
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
}

// Removes a user from the given class time ID
function removeUserFromClassTime(userID, classTimeID, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('DELETE FROM `UserClassTime` WHERE `userID` = ? AND `classTimeID` = ? LIMIT 1;', [userID, classTimeID], function(err, result) {
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
}

// Gets a user's timetable
function getUserTimetable(userID, semesterID, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('SELECT `classTimeID`, `classID`, `day`, `time`, `buildingNumber`, `roomNumber`, `sort`, `subjectID`, `duration` FROM `UserClassTime` NATURAL JOIN `ClassTime` NATURAL JOIN `Class` NATURAL JOIN `Subject` WHERE `userID` = ? AND `semesterID` = ?;', [userID, semesterID], function(err, rows) {
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
}

function getUserAttended(userID, semesterID, weekNumber, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('SELECT `classID`, `state` FROM `UserSubject` NATURAL JOIN `Subject` NATURAL JOIN `Class` NATURAL JOIN `WeeklyClass` LEFT OUTER JOIN Attended ON WeeklyClass.weeklyClassID = Attended.weeklyClassID WHERE `UserSubject`.`userID` = ? AND `SemesterID` = ? AND `weekNumber` = ?;', [userID, semesterID, weekNumber], function(err, rows) {
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
}

// Marks a class as attended
function markUserClassAttended(userID, weeklyClassID, state, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('REPLACE INTO `Attended` (`userID`, `weeklyClassID`, `state`) VALUES (?, ?, ?);', [userID, weeklyClassID, state], function(err, result) {
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
}

// Creates a new topic
function createTopic(userID, weeklyClassID, title, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('INSERT INTO `Topic` (`userID`, `weeklyClassID`, `title`, `upVotes`, `downVotes`, `postTime`) VALUES (?, ?, ?, 0, 0, NOW());', [userID, weeklyClassID, title], function(err, result) {
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
}

// Creates a new post
function createPost(userID, topicID, content, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('INSERT INTO `Post` (`userID`, `topicID`, `content`, `postTime`) VALUES (?, ?, ?, NOW());', [userID, topicID, content], function(err, result) {
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
}

// Define exports
exports.getSessionOptions = getSessionOptions;
exports.validateUser = validateUser;
exports.userExists = userExists;
exports.createUser = createUser;
exports.encryptePassword = encryptePassword;
exports.userByID = userByID;
exports.updateUserPassword = updateUserPassword;
exports.getSemesters = getSemesters;
exports.getWeeks = getWeeks;
exports.getClasses = getClasses;
exports.getTimes = getTimes;
exports.findTopics = findTopics;
exports.findPosts = findPosts;
exports.registerUserIntoSubject = registerUserIntoSubject;
exports.removeUserFromSubject = removeUserFromSubject;
exports.registerUserIntoClassTime = registerUserIntoClassTime;
exports.removeUserFromClassTime = removeUserFromClassTime;
exports.getUserTimetable = getUserTimetable;
exports.markUserClassAttended = markUserClassAttended;
exports.getUserAttended = getUserAttended;
exports.createTopic = createTopic;
exports.createPost = createPost;
