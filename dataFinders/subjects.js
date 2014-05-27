// Include dependencies
var fs = require('fs');
//var https = require('https');

// Jquery stuff
var cheerio = require('cheerio');

// A list of every subject
var subjectList = {};

// Handbook location
//var queryLink = 'https://handbook.unimelb.edu.au/faces/htdocs/user/search/SearchResults.jsp?SimpleSearchBody:SimpleSearchForm:keywords=SWEN30006';

/*var content = '';
https.get(queryLink, function(res) {
    res.on('data', function(chunk) {
        content += chunk;
        console.log(chunk);
    }).on('end', function() {
        // Load the page into cheerio
        var $ = cheerio.load(content);

        //console.log(content);
    });
});*/

fs.readFile('subjects_in.htm', 'ascii', function (err, data) {
    if (err) throw err;

    // Load page into cheerio
    var $ = cheerio.load(data);

    // Pull sem data
    var semData = {};
    function grabData() {
        // Grab all TDs
        var tds = $('td', this);

        // Grab the subject code
        var subjectCode = tds.eq(0).text();

        // Only accepting subjects with code of length 9
        if(subjectCode.length != 9) {
            // Ignore subject
            return;
        }

        // Make sure it's on the parkville campus
        if(tds.eq(4).text().indexOf('parkville') == -1) return;

        // Store this as a subject
        subjectList[subjectCode] = true;

        // Pull subject name
        var subjectName = tds.eq(1).text();

        // Grab the semester it is
        var semesterName = tds.eq(2).text();

        // Add an entry for each semester
        var sems = semesterName.split(', ');
        for(var key in sems) {
            // Grab a semester
            var sem = sems[key];

            // Ensure it exists
            semData[sem] = semData[sem] || [];

            // Store the data
            semData[sem].push({
                subjectCode: subjectCode,
                subjectName: subjectName
            });
        }
    }

    // Grab data
    var ug = $('#results_2 tr').each(grabData);
    var ug = $('#results_3 tr').each(grabData);

    // Store the semester data
    fs.writeFile('subjects.json', JSON.stringify(semData), function(err) {
        if(err) throw err;

        var l = '';
        for(var k in subjectList) {
            l += k+'\n';
        }

        fs.writeFile('subjectList.txt', l, function(err) {
            if(err) throw err;

            fs.writeFile('subjectList.json', JSON.stringify(subjectList), function(err) {
                if(err) throw err;

                console.log('Done saving!');
            });
        });
    });
});
