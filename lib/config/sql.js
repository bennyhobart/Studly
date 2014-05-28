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
    port     : 443,
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

    console.log(username+' - '+password);

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

// Exports
exports.getSessionOptions = getSessionOptions;
exports.encryptePassword = encryptePassword;
exports.getConnection = function(callback) {
  // Get a connection
  pool.getConnection(function(err, connection) {
    // Pass the connection
    callback(err, connection);
  });
}
exports.validateUser = validateUser;
