var fs = require('fs');
var semesters = require('./subjects.json');

// What to call the saved file
var saveName = 'build.sql';

var upto = 0;
function getNewName() {
    return '@'+(++upto);
}

// The actual SQL query to run
var sql = '';

// Loop over semesters
for(var semester in semesters) {
    // Insert string
    var semID = getNewName();
    sql += 'INSERT INTO `Semester` (`startDate`, `semesterName`) VALUES("2013-01-01", "'+semester+'");\n';
    sql += 'SET '+semID+':=LAST_INSERT_ID();\n';

    // Loop over all subjects
    for(var n in semesters[semester]) {
        // Grab a subject
        var subject = semesters[semester][n];

        // Get a new name for this subject
        var subjectID = getNewName();

        // Insert the subject
        sql += 'INSERT INTO `Subject` (`semesterID`, `subjectName`, `subjectCode`) VALUES('+semID+', "'+subject.subjectName+'", "'+subject.subjectCode+'");\n';
        sql += 'SET '+subjectID+':=LAST_INSERT_ID();\n';

        // Build class list

    }
}

// Store the final SQL
fs.writeFile(saveName, sql, function(err) {
    if(err) throw err;

    // Tell the user we finished
    console.log('Done building SQL, saved as '+saveName);
})

