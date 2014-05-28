var fs = require('fs');

var year = 2014;

// Load subjects
var subjects = fs.readFileSync('subjectList.txt', 'ascii').split('\r\n');

// Stores all the values we are going to insert
var values = [];

// Loop over all subjects
for(var key in subjects) {
    var subject = subjects[key].toUpperCase();

    // Check if subject exists
    if(fs.existsSync('./static/handbook/'+year+'/'+subject+'.json')) {
        // Load data
        console.log('Loading '+subject);
        var data = fs.readFileSync('./static/handbook/'+year+'/'+subject+'.json');

        values.push([
            subject, data
        ]);
    }
}

fs.writeFile('handbook.sql.json', JSON.stringify(values), function(err) {
    if(err) throw err;

    console.log('saved handbook.sql.json');
});