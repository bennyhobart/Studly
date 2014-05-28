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

var fs = require('fs');

var year = 2014;

// Load subjects
var subjects = fs.readFileSync('subjectList.txt', 'ascii').split('\r\n');

// Stores all the values we are going to insert
var values = [];

// Loop over all subjects
for(var key in subjects) {
    (function(){
        var subject = subjects[key].toUpperCase();

        // Check if subject exists
        if(fs.existsSync('./static/handbook/'+year+'/'+subject+'.json')) {
            // Load data
            console.log('Loading '+subject);
            var data = fs.readFileSync('./static/handbook/'+year+'/'+subject+'.json');

            // Test the connection
            pool.getConnection(function(err, connection) {
                console.log('Inserting '+subject);
                connection.query('INSERT INTO `Handbook` (`subjectCode`, `handbookData`) VALUES (?, ?)', [subject, data], function(err, result) {
                    if(err) throw err;

                    console.log('done!');

                    // Release the connection
                    connection.release();
                })
            });
        }
    })();
}
