var fs = require('fs');
var httpRequest = require('./httprequest.js');
var cheerio = require('cheerio');
var parseString = require('xml2js').parseString;
var mysql = require('mysql');

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

// Video Caching Settings
var videoCache = {
    // This is the YYWW we should start at
    startAt: 1401,

    // This contains a list of cached pages at the startAt section
    cached: {}
};

// Where to cache history to
var videoCacheFile = './videoCache.json'

// Attempt to load the cache
try {
    videoCache = require(videoCacheFile);
}catch(e){}

// The main root for caching videos
var root = 'http://download.lecture.unimelb.edu.au/echo360/';

// Is there a cache in progress?
var cacheInProgress = false;

// List of stuff left to cache
var weeksToCache = [];
var weekNumberToCache = [];
var fieldsToCache = [];

// Used to convert month names to numbers
var monthNameToNum = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12
}

// Starts the caching process
function startCaching() {
    // If we are already caching, don't start again!
    if(cacheInProgress) return false;
    cacheInProgress = true;

    // Request the main query page
    httpRequest.get(root, function(err, content) {
        if(err) {
            // Restart from this step
            cacheInProgress = false;
            startCaching();
            console.log('Request for a root has timed out. Trying again...');
            return;
        }

        // Load the page into cheerio
        var $ = cheerio.load(content);
        $('table tr a').slice(5).each(function() {
            // Grab the number
            var number = parseInt($(this).text());

            // Skip if we've already cached it
            if(isNaN(number) || number < videoCache.startAt) return;

            // Store this as needing to be cached
            weeksToCache.push(number);
        });

        // Start caching a week
        cacheWeek();
    });
}

// Caches the next week in the list
function cacheWeek() {
    // Check if there are any weeks left to cache
    if(weeksToCache.length == 0) {
        console.log('Done caching weeks!');
        return;
    }

    // Grab the current week
    var week = weeksToCache.shift();

    // Update where to start
    videoCache.startAt = week;
    videoCache.cached = {};

    // Tell the user what is doing on
    console.log('Caching week '+week);

    // Request the page for the current week
    httpRequest.get(root+week+'/', function(err, content) {
        if(err) {
            // Restart from this step
            console.log('Caching week has failed!');
            weeksToCache.unshift(week);
            cacheWeek();
            return;
        }

        // Load the page into cheerio
        var $ = cheerio.load(content);
        $('table tr a').slice(5).each(function() {
            // Grab the number
            var number = parseInt($(this).text());

            // Make sure it's valid
            if(isNaN(number)) return;

            // Store this as needing to be cached
            weekNumberToCache.push(week+'/'+number+'/');
        });

        // Start caching a week number
        cacheWeekNumber();
    });
}

// Caches a week number
function cacheWeekNumber() {
    // Check if there is anything to cache
    if(weekNumberToCache.length == 0) {
        console.log('Done caching week numbers!');
        cacheWeek();
        return;
    }

    // Grab the current week number
    var weekNumber = weekNumberToCache.shift();

    // Tell the user what is doing on
    console.log('Caching week number '+weekNumber);

    // Request the page for the current week
    httpRequest.get(root+weekNumber, function(err, content) {
        if(err) {
            // Restart from this step
            console.log('Caching week number has failed!');
            weekNumberToCache.unshift(weekNumber);
            cacheWeekNumber();
            return;
        }

        // Load the page into cheerio
        var $ = cheerio.load(content);
        $('table tr a').slice(5).each(function() {
            // Grab the number
            var field = $(this).text();

            // Store this as needing to be cached
            fieldsToCache.push(weekNumber+field+'/');
        });

        // Start caching a week number
        cacheField();
    });
}

// Caches a field
function cacheField() {
    // Check if there is anything to cache
    if(fieldsToCache.length == 0) {
        console.log('Done caching fields!');
        cacheWeekNumber();
        return;
    }

    // Grab the current week number
    var field = fieldsToCache.shift();

    // Tell the user what is doing on
    console.log('\nCaching field '+field);

    // Check if it's already been cached
    if(videoCache.cached[field]) {
        console.log('Already cached :(');
        cacheField();
        return;
    }

    // Request the page for the field
    httpRequest.get(root+field+'presentation.xml', function(err, content) {
        if(err) {
            // Restart from this step
            console.log('Caching field has failed!');
            weekNumberToCache.unshift(field);
            cacheField();
            return;
        }

        // Tell the user what is going on
        console.log('Parsing presentation.xml...');

        // Attempt to parse the XML content
        parseString(content, function (err, result) {
            if(err) {
                // Nothing much we can do, ignore it and move on
                console.log('Failed to cache field '+field);
                cacheField();
                return;
            }

            // Update the user
            console.log('Grabbing useful info...');

            // Safe way of parsing data
            try {
                // Grab info on this video
                var name = result['session-info']['presentation-properties'][0].name[0];
                var code = name.split('(')[1].split('-')[0];

                // Workout the date
                var date = result['session-info']['presentation-properties'][0]['start-timestamp'][0].split(' ');
                var year = parseInt(date[2]);
                var month = monthNameToNum[date[0]];
                var day = parseInt(date[1]);

                var niceDate = year+'-'+month+'-'+day;

                var dayNumber = new Date(year, month-1, day).getDay();

                // Grab thumbnails
                var thumbsBad = result['session-info']['group'][2]['track'][2]['data'];
                var thumbs = [];
                for(var key in thumbsBad) {
                    thumbs.push(thumbsBad[key]['$'].uri);
                }
            } catch(e) {
                // Move on
                console.log('Failed to cache field (2) '+field);
                cacheField();
                return;
            }

            console.log('Attemping to find weeklyClassID...');

            // Store that we have cached it now
            videoCache.cached[field] = true;

            // Store the recording
            storeRecording(code, niceDate, dayNumber, field, thumbs);
        });
    });
}

// Stores a recording
function storeRecording(subjectCode, niceDate, dayNumber, field, thumbs) {
    // Grab a MYSQL connection
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            console.log('Failed to get a connection, trying again...');
            storeRecording(subjectCode, niceDate, dayNumber, field, thumbs);
            return;
        }

        // Attempt to find the weeklyClassID that matches
        connection.query('SELECT `weeklyClassID` FROM `Subject` NATURAL JOIN `Semester` INNER JOIN `SemesterWeek` ON `Semester`.`SemesterID`=`SemesterWeek`.`SemesterID` NATURAL JOIN `Class` NATURAL JOIN `ClassTime` INNER JOIN `WeeklyClass` ON `WeeklyClass`.`weekID`=`SemesterWeek`.`weekID` AND `WeeklyClass`.`classID`=`Class`.`classID` WHERE `subjectCode`=? AND `SemesterWeek`.`startDate` > DATE_SUB(?, INTERVAL 7 DAY) AND `SemesterWeek`.`startDate` <= ? AND `Class`.`Sort`=0 AND `day`=? LIMIT 1;', [subjectCode, niceDate, niceDate, dayNumber], function(err, rows) {
            if(err) {
                connection.release();
                console.log('MYSQL Query (1) Failed! Trying again...');
                console.log(err);
                storeRecording(subjectCode, niceDate, dayNumber, field, thumbs);
                return;
            }

            // Check if we found the weeklyClassID
            if(rows.length > 0) {
                var weeklyClassID = rows[0].weeklyClassID;

                // Another update
                console.log('Found weeklyClassID, attempting to store...');

                // Woot! Store the recording baby!
                connection.query('INSERT INTO `WeeklyClassRecording` (`weeklyClassID`, `baseLink`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `baseLink`=?', [weeklyClassID, root+field, root+field], function(err, result) {
                    if(err) {
                        connection.release();
                        console.log('MYSQL Query (2) Failed! Trying again...');
                        console.log(err);
                        storeRecording(subjectCode, niceDate, dayNumber, field, thumbs);
                        return;
                    }

                    // Insert thumbs
                    if(thumbs.length > 0) {
                        var values = [];
                        for(var key in thumbs) {
                            values.push([
                                weeklyClassID,
                                thumbs[key]
                            ]);
                        }

                        // Store thumbs
                        connection.query('INSERT INTO `WeeklyClassThumbs` (`weeklyClassID`, `thumbNail`) VALUES ?', [values], function(err, result) {
                            if(err) {
                                connection.release();
                                console.log('MYSQL Query (3) Failed! Trying again...');
                                console.log(err);
                                storeRecording(subjectCode, niceDate, dayNumber, field, thumbs);
                                return;
                            }

                            // Free Connection
                            connection.release();

                            // Woot! We did it!
                            console.log('We found everything for '+subjectCode);

                            // Store this video as cached
                            videoCache.cached[field] = true;

                            // Save and move on
                            saveCache(function() {
                                // Cache the next field
                                cacheField();
                            });
                        });
                    } else {
                        // No thumbs, WTF?
                        console.log('No thumbs found for '+subjectCode);

                        // Free Connection
                        connection.release();

                        // Store this video as cached
                        videoCache.cached[field] = true;

                        // Save and move on
                        saveCache(function() {
                            // Cache the next field
                            cacheField();
                        });
                    }
                });
            } else {
                // Failure :(
                console.log('Failed to find weekClassID for '+subjectCode);

                // Store this video as cached
                videoCache.cached[field] = true;

                // Free Connection
                connection.release();

                // Save and move on
                saveCache(function() {
                    // Cache the next field
                    cacheField();
                });
            }
        });
    });
}

// Saves the current cache, then continutes
function saveCache(cont) {
    // Attempt to write the file
    fs.writeFile(videoCacheFile, JSON.stringify(videoCache), function(err) {
        // If it fails to write, try again!
        if(err) {
            console.log('Failed to save file!');
            saveCache(cont);
            return;
        }

        // Run the callback if we got one
        if(cont) cont();
    });
}

// Begin Caching
startCaching();
