var fs = require('fs');
var https = require('https');
var querystring = require('querystring');

// The year to cache data for
var year = 2014;

// Create directories:
if(!fs.existsSync('timetable')) {
    fs.mkdirSync('timetable');
}

function GetTimetable(code, yr, callback, errorCallback) {
    // Remove white spaces from code, make upper case:
    code = code.trim().toUpperCase();

    var post_data = querystring.stringify({
        scodes: code,
        year: parseInt(yr),
        sortby: 'act'
    });

    var options = {
        hostname: 'sis.unimelb.edu.au',
        path: '/cgi-bin/subjects.pl',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
        }
    };

    var html_data = '';
    var req = https.request(options, function(res) {
        res.on('data', function(d) {
            html_data+=d;
        });

        res.on('end', function() {
            // for error callback:
            var foundData = false;

            // Process the data:
            var count = html_data.split('<h2>Year:').length - 1;

            // Did we fail:
            if(count <= 0) {
                // No results found:
                if(errorCallback) {
                    errorCallback('Failed to find subject!');
                    return false;
                }
            }

            var result = new Array();

            // Process results:
            var pos = 0;
            for(var i=0;i<count;i++) {
                pos = html_data.indexOf('<h2>Year:', pos);
                var end = html_data.indexOf('</table>', pos);
                var d = html_data.substr(pos, end-pos);

                // Grab the subject name:
                var a = d.indexOf(code)+code.length+1;
                var name = d.substr(a, d.indexOf('</b>')-a);
                a = name.indexOf(')');

                // Remove bracket:
                if(a != -1) {
                    name = name.substr(a+2);
                }

                // Workout which year the data is from:
                var a = d.indexOf(' &nbsp; ')+8;
                var year = d.substr(10, d.indexOf(' &nbsp;')-10);
                var semester = d.substr(a, d.indexOf('</h2>')-a);

                // Chop down the data:
                d = d.substr(d.indexOf('<tr>'), d.length);
                d = d.split('</tr>');

                var data = new Array();

                // Process data:
                for(var j=0;j<d.length-1;j++) {
                    // Temp data array:
                    var dta = new Array()

                    // Split our string:
                    var dd = d[j].split('</td>');

                    // Process our string:
                    for(var k=2;k<dd.length-1;k++) {
                        dta.push(dd[k].substr(4));
                    }

                    // Fix class length:
                    dta[4] = parseFloat(dta[4]);

                    // Store dta:
                    data.push(dta);
                }

                // Push the data on:
                result.push({
                    sem:semester,
                    data:data
                });

                // Move pos forward:
                pos += 1;
            }

            // Ensure directories exist:
            if(!fs.existsSync('timetable/'+year)) {
                fs.mkdirSync('timetable/'+year);
            }

            var fin = JSON.stringify({name:name,code:code,year:year,data:result});

            // Store the results:
            fs.writeFile('timetable/'+year+'/'+code+'.json', fin, function(err) {
                if(err) {
                    console.log(err);
                }
            });

            callback(fin);
        });
    });
    req.write(post_data);
    req.end();

    req.on('error', function(e) {
        console.log(e);

        if(errorCallback) {
            errorCallback('request error');
            return false;
        }
    });
}

// Build a list of what needs to be cached
var subjectList = require('./subjectList.json');
var toCache = [];
for(var subject in subjectList) {
    toCache.push(subject);
}

// Workout how many in total there are
var total = toCache.length;

function next() {
    // Ensure we have something to cache
    if(toCache.length <= 0) return;

    // Grab a code
    var code = toCache.pop();

    // Tell the user what is going on
    console.log('Caching subject '+(total-toCache.length)+'/'+total+' - '+code);

    // Do the caching
    GetTimetable(code, year, function() {
        // Continue caching
        next();
    }, function(err) {
        // Nawwwwww, there was an error :(
        console.log('there was an error :(');
        console.log(err);
        next();
    });
}

next();
