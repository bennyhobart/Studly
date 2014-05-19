// Include dependencies
var fs = require('fs');
var http = require('http');

// Jquery stuff
var cheerio = require('cheerio');

// Padding to remove when detecting fields
var fieldPadding = '<strong>:</strong> ';

/*
Building Cacher Class
*/
function buildingCacher(rootName, href, callback) {
    // Store the root directory
    this.toCache = [];

    // Where all the data will be stored
    this.data = {};

    // We have to cache the root
    this.toCache.push({
        name: rootName,
        href: href,
        store: this.data
    });

    // Store callback
    this.callback = callback;

    // Start Caching
    this.cache();
}

// This caches the next building in the list
buildingCacher.prototype.cache = function() {
    // Reference to this local object
    var thisMap = this;

    // Ensure there is something to cache
    if(thisMap.toCache.length <= 0) return;

    // Tell user how much is left to cache
    console.log('\nLeft to cache = '+thisMap.toCache.length);

    // Grab what we need to cache
    var toCache = thisMap.toCache.pop();

    // Tell the user what we're caching
    console.log('Caching: '+toCache.name+' ('+toCache.href+')');

    // Request the page (this will have a link to rooms)
    var content = '';
    http.get(toCache.href, function(res) {
        res.on('data', function(chunk) {
            content += chunk;
        }).on('end', function() {
            // Load the page into cheerio
            var $ = cheerio.load(content);

            // Contains fields for this building
            var fields = {};

            // See if there is any information about this building
            $('.col-6.first .col-4.first ul li').each(function() {
                // Used to grab data
                var link = $(this);

                // Grab the name of the field
                var fieldName = $('strong', link).html();
                var fieldValue = '';

                // Make sure we found a fieldName
                if(fieldName) {
                    // Remove the colon from the field name
                    fieldName = fieldName.substring(0, fieldName.length-1);

                    // Grab the value of the field
                    fieldValue = link.html().substring(fieldName.length+fieldPadding.length);
                } else {
                    var subLink = $('a', link);
                    if(!subLink) return;

                    // Fieldname is now the text that appear on the href
                    fieldName = subLink.html();

                    // Fieldvalue is now the href part
                    fieldValue = subLink.attr('href');
                }

                // Store info
                fields[fieldName] = fieldValue;

                // Tell the user the field's we found
                console.log(fieldName+' - '+fieldValue);
            });

            // List of children
            fields.children = {};

            $('.within ul li a').each(function() {
                // Grab useful stuff
                var link = $(this);
                var name = link.html();
                var href = link.attr('href');

                // Check if it's a PDF
                if(href.substring(href.length-4) == '.pdf') {
                    // Store the link to the pdf
                    fields[name] = href;

                    // Don't try to cache it
                    return;
                }

                // Add it to the list of things to cache
                thisMap.toCache.push({
                    name: name,
                    href: href,
                    store: fields.children
                });
            });

            // Store into parent
            toCache.store[toCache.name] = fields;

            // Check if there is anything else to cache
            if(thisMap.toCache.length > 0) {
                // Yes, continue caching
                thisMap.cache();
            } else {
                // No, run callback if it exists
                if(thisMap.callback) thisMap.callback(thisMap.data);
            }
        });
    });
}

/*
//Redmond Barry test
new buildingCacher('Redmond Barry Building', 'http://maps.unimelb.edu.au/parkville/building/115#.U0TgUvmSzHU', function(data) {
    console.log('Done caching, saving...');
    fs.writeFile('maps.json', JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('maps.json saved!');
    });
});*/


// Root Test
new buildingCacher('root', 'http://maps.unimelb.edu.au/parkville/building/', function(data) {
    console.log('Done caching, saving...');
    fs.writeFile('maps.json', JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('maps.json saved!');
    });
});

/*
// ERC Test Case
new buildingCacher('ERC', 'http://maps.unimelb.edu.au/parkville/building/171/ERC', function(data) {
    console.log('Done caching, saving...');
    fs.writeFile('maps.json', JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('maps.json saved!');
    });
});
*/

/*
Copied from http://stackoverflow.com/questions/130404/javascript-data-formatting-pretty-printer
modified to be more readable in html format
*/
/*function strRep(str, count) {
    var output = '';
    for(var i=0; i<count; i++) {
        output += str;
    }

    return output;
}

function DumpObject(obj, padding) {
    padding = padding || 0;

    var result = "";
    var len = 0;

    var p = strRep('&nbsp;', padding);

    var first = true

    for (var property in obj) {
        if(first) {
            first = false;
        } else {
            result = result + ',<br>';
        }

        var value = obj[property];
        if (typeof value == 'string') {
            value = "'" + value + "'";
        } else if (typeof value == 'object') {
            if (value instanceof Array) {
                value = p+'[<br>'+p+value + '<br>'+p+']';
            } else {
                value = '{<br>' + DumpObject(value, padding+4) + '<br>'+p+'}';
            }
        }
        result += p+"'" + property + "' : " + value;
        len++;
    }

    return result.replace(/, $/, '');
}

var od = DumpObject(require('./maps.json'));

fs.writeFile('maps.htm', od, function (err) {
    if (err) throw err;
    console.log('Saved maps.htm');
});
*/