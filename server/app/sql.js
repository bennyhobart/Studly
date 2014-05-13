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

// Define exports
exports.getSessionOptions = getSessionOptions;
exports.validateUser = validateUser;
exports.userExists = userExists;
exports.createUser = createUser;
exports.encryptePassword = encryptePassword;
exports.userByID = userByID;
exports.updateUserPassword = updateUserPassword;

/*
 * TESTING STUFF
 */

return;

// Check if a user exists
userExists('ash47', function(err, exists) {
    if(err) throw err;

    if(exists) {
        // User exists, lets try and login
        console.log('User account exists!');

        validateUser('ash47', 'password', function(err, data) {
            if(err) throw err;

            if(data.userID == -1) {
                console.log('Failed to login!');
            } else {
                console.log('Logged in, got userID '+data.userID+', username = '+data.username);
            }
        });
    } else {
        // User doesn't exist, create it
        console.log('Creating account...');

        createUser('Ash47', 'password', function(err, userID) {
            if(err) {
                console.log('Failed to create user!');
                return;
            }

            console.log('Created new user, gave him ID: '+userID);
        });
    }
})
