var mysql = require('mysql');

/*var pool = mysql.createPool({
    host     : '127.0.0.1',
    user     : 'studly',
    password : 'studly',
    database : 'studly'
});*/

var pool = mysql.createPool({
    host     : 'ash47.net',
    user     : 'studly',
    password : '38)!ou_X[2481UTgs@483f0pfk24nL',
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

// Checks if a username + password combo is valid
function validateUser(username, password, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('SELECT `userID`, `username` FROM `User` WHERE `username` = "?" AND `password` = "?" LIMIT 1', [username, password], function(err, rows) {
            if(err) {
                connection.release();
                return callback(err);
            }

            // Release the connection
            connection.release();

            // Grab userID
            var userID = -1;
            var username = null;
            if(rows.length>0) {
                userID = rows[0].userID;
                username = rows[0].username;
            }

            // Run callback
            callback(null, userID, username);
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

        connection.query('SELECT * FROM `User` WHERE `username` = "?" LIMIT 1', [username], function(err, rows) {
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

// Creates an account for the given user
function createUser(username, password, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            return callback(err);
        }

        connection.query('INSERT INTO `User` (`username`, `password`) VALUES ("?", "?")', [username, password], function(err, result) {
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

// Define exports
exports.validateUser = validateUser;
exports.userExists = userExists;
exports.createUser = createUser;

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

        validateUser('ash47', 'password', function(err, userID, username) {
            if(err) throw err;

            if(userID == -1) {
                console.log('Failed to login!');
            } else {
                console.log('Logged in, got userID '+userID+', username = '+username);
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
