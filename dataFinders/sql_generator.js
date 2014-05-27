var fs = require('fs');
var semesters = require('./subjects.json');

// What to call the saved file
var saveName = 'build.sql';

var upto = 0;
function getNewName() {
    return '@'+(++upto);
}

// The year to run this for
var year = 2014;

// The actual SQL query to run
var sql = '';

// Converts numbers into codes
var numberToCode = {
    0: 'L',
    1: 'P',
    2: 'S',
    3: 'T',
    4: 'W',
    5: 'PB',
    6: 'FW',
    7: 'BI',
    8: 'BO',
    9: 'CL',
    10: 'CP',
    11: 'CR',
    12: 'CC',
    13: 'FM',
    14: 'IC',
    15: 'IP',
    16: 'LE',
    17: 'PF',
    18: 'PC',
    19: 'RH',
    20: 'SC',
    21: 'ST'
}

// Create the inverse of that
var codeToNumber = {};
for(var key in numberToCode) {
    codeToNumber[numberToCode[key]] = key;
}

// Day text to number
var dayTextToNumber = {
    'Monday': 0,
    'Tuesday': 1,
    'Wednesday': 2,
    'Thursday': 3,
    'Friday': 4,
    'Saturday': 5,
    'Sunday': 6
}

// Load recordings
var recordings = require('./recordings.json');

// Generate something useful from it
var buildings = {};
function processMapTree(top) {
    if(!top) return;

    for(var key in top) {
        var b = top[key];
        if(b['Building Number']) {
            buildings[key] = b['Building Number'];

            // Check if it has another name
            if(b['Alternate Name']) {
                buildings[b['Alternate Name']] = b['Building Number'];
            }
        }

        // Recurse!
        processMapTree(b.children);
    }
}
processMapTree(require('./maps.json'));

// Loop over semesters
for(var semesterKey in semesters) {
    // We need a new scope for this part
    (function() {
        // We are only going to build data for the first and second semester
        if(semesterKey != 'semester 1' && semesterKey != 'semester 2') {
            console.log('Skipped '+semesterKey);
            return;
        }

        // Ensure it is formatted correctly
        var semester = semesterKey.charAt(0).toUpperCase() + semesterKey.slice(1).toLowerCase();

        // Tell the user what is doing on
        console.log('Processing '+semester);

        // Insert string
        var semID = getNewName();
        sql += 'INSERT INTO `Semester` (`startDate`, `semesterName`) VALUES("2013-01-01", "'+semester+'");\n';
        sql += 'SET '+semID+':=LAST_INSERT_ID();\n';

        // Loop over all subjects
        for(var n in semesters[semesterKey]) {
            // We need a new scope inside this for loop
            (function() {
                // Grab a subject
                var subject = semesters[semesterKey][n];

                // Grab the subject code
                var code = subject.subjectCode;

                // See if we have any class data for this
                fs.exists('timetable/'+year+'/'+code+'.json', function (exists) {
                    if(exists) {
                        // Grab the time info
                        var timeInfo = require('./timetable/'+year+'/'+code+'.json').data;

                        // Creating a list of classes
                        var classes = {};

                        // Attempt to find the correct semester
                        for(var i=0; i<timeInfo.length; i++) {
                            // Check if this is our semester
                            if(timeInfo[i].sem == semester) {
                                // Grab Class data
                                var cdata = timeInfo[i].data;

                                // Loop over each class in this semester
                                for(var j=0; j<cdata.length; j++) {
                                    // Grab the data
                                    var sdata = cdata[j];

                                    // Grab the type of class
                                    var classType = sdata[0].split('/')[0];

                                    // Ensure we have storage for this class
                                    classes[classType] = classes[classType] || [];

                                    // Grab building name
                                    var bn = sdata[3].split('-')[0].split(':');
                                    var buildingName = bn[1] || bn[0];

                                    // Grab building number
                                    var buildingNumber = 0;

                                    // Search for the real building number
                                    for(var key in buildings) {
                                        if(key.indexOf(buildingName) != -1 || buildingName.indexOf(key) != -1) {
                                            buildingNumber = parseInt(buildings[key]);
                                        }
                                    }

                                    // Check if we were successful
                                    if(buildingNumber == 0) {
                                        console.log('WARNING: Failed to find building '+buildingName);
                                    }

                                    // Grab room number
                                    var roomNumber = sdata[3].split('-')[1];
                                    if(roomNumber) {
                                        roomNumber = roomNumber.split(' ')[0];
                                    } else {
                                        roomNumber = '';
                                    }

                                    // Grab the day
                                    var day = dayTextToNumber[sdata[1]];

                                    // Convert to mysql readable time
                                    var timeFull = sdata[2].split(' - ')[0].split(':');
                                    var timeLeft = parseInt(timeFull[0]);
                                    var timeRight = timeFull[1];
                                    if(timeRight.indexOf('pm') != -1) {
                                        timeLeft += 12;
                                    }

                                    // Store this class type
                                    classes[classType].push({
                                        day: day,
                                        time: timeLeft+':'+parseInt(timeRight),
                                        location: sdata[3],
                                        duration: sdata[4],
                                        buildingNumber: buildingNumber,
                                        roomNumber: roomNumber,
                                        sisBuildingName: buildingName
                                    });
                                }
                            }
                        }

                        // Get a new name for this subject
                        var subjectID = getNewName();

                        // Grab details
                        var subjectName = subject.subjectName.replace(/["]/g, '\\"');
                        var subjectCode = subject.subjectCode;

                        var echoLink = '';

                        // Find recording link
                        for(var key in recordings) {
                            var r = recordings[key];
                            // Match the code
                            if(r.id == subjectCode) {
                                // Match the year
                                if(r.term.indexOf(year) != -1) {
                                    // If we haven't found it before, just take it
                                    if(!echoLink) echoLink = r.url;

                                    // Do more strict checking:
                                    if(semester == 'Semester 1') {
                                        if(r.term.indexOf('Sem1') != -1 || r.term.indexOf('SM1') != -1) {
                                            echoLink = r.url;
                                        }
                                    }

                                    if(semester == 'Semester 2') {
                                        if(r.term.indexOf('Sem2') != -1 || r.term.indexOf('SM2') != -1) {
                                            echoLink = r.url;
                                        }
                                    }
                                }
                            }
                        }

                        // Insert the subject
                        sql += 'INSERT INTO `Subject` (`semesterID`, `subjectName`, `subjectCode`, `echoLink`) VALUES('+semID+', "'+subjectName+'", "'+subjectCode+'", "'+echoLink+'");\n';
                        sql += 'SET '+subjectID+':=LAST_INSERT_ID();\n';

                        // Insert all of the classes and class times

                        for(var key in classes) {
                            // Grab the class sort
                            var classSort = key.replace(/[^A-Za-z]/g, "");
                            var classSortCode = codeToNumber[classSort];
                            if(classSortCode == null) {
                                console.log('WARNING: Failed to find class of sort: '+classSort);
                                continue;
                            }

                            // Grab all the classes in this list
                            var cc = classes[key];

                            // Pull the duration from the first class time
                            var duration = cc[0].duration;

                            // Grab a new name
                            var classID = getNewName();

                            // Insert the class
                            sql += 'INSERT INTO `Class` (`subjectID`, `sort`, `duration`) VALUES('+subjectID+', '+classSortCode+', '+duration+');\n';
                            sql += 'SET '+classID+':=LAST_INSERT_ID();\n';

                            // Insert all the times for this subject
                            for(var key in cc) {
                                // Grab a subject
                                var c = cc[key];

                                // Create the SQL
                                sql += 'INSERT INTO `ClassTime` (`classID`, `day`, `time`, `buildingNumber`, `roomNumber`, `sisBuildingName`) VALUES('+classID+', '+c.day+', TIME("'+c.time+'"), '+c.buildingNumber+', "'+c.roomNumber+'", "'+c.sisBuildingName+'");\n';
                            }
                        }
                    } else {
                        console.log('No timetable data exists for '+code);
                    }
                });
            })();
        }
    })();
}

function exitHandler(options, err) {
    // Store the final SQL
    fs.writeFileSync(saveName, sql);
    console.log('Done building SQL, saved as '+saveName);
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));
