var mysql = require('mysql');
var fs = require('fs');

var databaseInfo = {
    host     : 'ash47.net',
    port     : 3306,
    user     : 'studly',
    password : '38)!ou_X[2481UTgs@483f0pfk24nL'
}

var pool = mysql.createPool({
    host     : databaseInfo.host,
    port     : databaseInfo.port,
    user     : databaseInfo.user,
    password : databaseInfo.password,
    database : 'studly',
    multipleStatements: true
});

// Test the connection
pool.getConnection(function(err, connection) {
    fs.readFile('build.sql', 'ascii', function (err, data) {
        if (err) throw err;

        connection.query(data, function(err, result) {
            if(err) throw err;

            console.log('done!');

            // Release the connection
            connection.release();
        })
    });
});